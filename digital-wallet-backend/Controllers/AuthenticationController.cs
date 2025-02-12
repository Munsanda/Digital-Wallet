using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using digital_wallet_backend.Models.Account;
using Microsoft.EntityFrameworkCore;
using digital_wallet_backend.Models;
using digital_wallet_backend.Services;

namespace digital_wallet_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IDigitalWallet<Wallet> _walletService;
        private readonly RoleManager<IdentityRole> _roleManager; // Fixed RoleManager type
        private readonly IConfiguration _configuration;

        public AuthenticateController(
            UserManager<ApplicationUser> userManager,
            IDigitalWallet<Wallet> walletService,
            RoleManager<IdentityRole> roleManager, // Fixed RoleManager type
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _walletService = walletService;
        }

        [HttpPost]
        [Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim("UserId", user.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                foreach (var userRole in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                }

                var token = GetToken(authClaims);

                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expiration = token.ValidTo
                });
            }
            return Unauthorized(new { Message = "Invalid phone number or password" });
        }

       [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
            if (userExists != null)
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Phone number already registered!" });

            ApplicationUser user = new()
            {
                UserName = model.PhoneNumber,
                PhoneNumber = model.PhoneNumber,
                FullName = model.FullName,  
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Step 1: Create and save the user first
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "User creation failed! Please try again." });

            // Step 2: Now that the user is saved, create the wallet
            var wallet = new Wallet
            {
                Balance = 0,
                UserId = user.Id // Now user.Id exists
            };

            await _walletService.CreateAsync(wallet);

            // Step 3: Update the user to link the WalletId
            user.WalletId = wallet.Id.ToString();
            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "Error linking wallet to user" });

            return Ok(new { Message = "User created successfully!" });
        }



        [HttpPost]
        [Route("register-admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.Users.FirstOrDefaultAsync(u => u.PhoneNumber == model.PhoneNumber);
            if (userExists != null)
                return StatusCode(StatusCodes.Status400BadRequest, new { Message = "Phone number already registered!" });

            // Fix: Use ApplicationUser instead of IdentityUser
            ApplicationUser user = new()
            {
                UserName = model.PhoneNumber,
                PhoneNumber = model.PhoneNumber,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError, new { Message = "User creation failed! Please try again." });

            // Fix: Ensure roles exist before assigning them
            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin)); // Fixed role creation

            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User)); // Fixed role creation

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }
            return Ok(new { Message = "Admin registered successfully!" });
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.UtcNow.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }
    }
}
