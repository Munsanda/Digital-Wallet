using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using digital_wallet_backend.Services;
using digital_wallet_backend.Models;
using digital_wallet_backend.Data;
using Microsoft.EntityFrameworkCore;
using digital_wallet_backend.DTOs;
using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace digital_wallet_backend.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    
    public class WalletController : ControllerBase
    {
        private readonly IDigitalWallet<Transaction> _transactionService;
        private readonly IDigitalWallet<Wallet> _walletService;
        private readonly DigitalWalletDbContext _context;
        private readonly IMapper _mapper;

        public WalletController(IDigitalWallet<Transaction> transactionService, 
                                IDigitalWallet<Wallet> walletService,  
                                DigitalWalletDbContext context,
                                IMapper mapper)
        {
            _transactionService = transactionService;
            _walletService = walletService;
            _context = context;
            _mapper = mapper;
        }

        // Get Logged-in User Details
        [HttpGet("user")]
        public async Task<ActionResult<object>> GetUser()
        {
            // Get the logged-in user's ID from claims
            var userId = User.FindFirst("UserId")?.Value;

            if (string.IsNullOrEmpty(userId))
            return Unauthorized("User not authenticated");

            // Retrieve the user from the database
            var user = await _context.Set<ApplicationUser>()
            .Include(u => u.Wallet)
            .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            return NotFound("User not found");

            // Return the user's details
            var userDetails = new
            {
                walletId = user.Wallet.Id,
                Name = user.FullName,
                PhoneNumber = user.PhoneNumber,
                Balance = user.Wallet.Balance
            };

            return Ok(userDetails);
        }

        // Get Wallet Balance
        [HttpGet("balance")]
        public async Task<ActionResult<decimal>> GetBalance()
        {
            Console.WriteLine("In the function");
            foreach (var claim in User.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }
            // Get the logged-in user's ID from claims
            var userId = User.FindFirst("UserId")?.Value;
            Console.WriteLine("Extracted User ID from JWT: " + userId);


            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");


            // Retrieve the wallet linked to this user
            var wallet = await _walletService.GetByUserIdAsync(userId);
            
            if (wallet == null)
                return NotFound("Wallet not found");

            return Ok(wallet.Balance);
        }


        // Get Recent Transactions with Pagination
        [HttpGet("transactions")]
        public async Task<ActionResult<IEnumerable<TransactionDTO>>> GetTransactions( int page = 1, int pageSize = 10)
        {
            // Get the logged-in user's ID from claims
            var userId = User.FindFirst("UserId")?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

            // Retrieve the wallet linked to this user
            var wallet = await _walletService.GetByUserIdAsync(userId);

            var transactions = await _transactionService.GetAllTransactionsWithReceiverWalletAsync(wallet.Id);


            var paginatedTransactions = transactions
                .OrderByDescending(t => t.Timestamp)
                .Skip((page - 1) * pageSize)
                .Take(pageSize);
            return Ok(paginatedTransactions);
        }

        // Send Money
        [HttpPost("transfer")]
        public async Task<ActionResult> TransferMoney([FromBody] TransactionDTO transaction)
        {
            // Get the logged-in user's ID from claims
            var userId = User.FindFirst("UserId")?.Value;
            
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("User not authenticated");

            // Retrieve the wallet linked to this user
            var senderWallet = await _walletService.GetByUserIdAsync(userId);

            Console.WriteLine("Sender Wallet ID: " + senderWallet.Id);

            //var senderWallet = await _walletService.GetByIdAsync(transaction.SenderWalletId);
            var receiverWallet = await _walletService.GetByIdAsync(transaction.ReceiverWalletId);

            Console.WriteLine("Receiver Wallet ID: " + transaction.ReceiverWalletId);

            if (senderWallet == null || receiverWallet == null)
                return NotFound("Sender or Receiver wallet not found");

            if (senderWallet.Balance < transaction.Amount)
                return BadRequest("Insufficient balance");

            senderWallet.Balance -= transaction.Amount; 
            receiverWallet.Balance += transaction.Amount;

            await _walletService.UpdateAsync(senderWallet.Id, senderWallet);
            await _walletService.UpdateAsync(receiverWallet.Id, receiverWallet);

            transaction.SenderWalletId = senderWallet.Id;

            await _transactionService.CreateAsync(_mapper.Map<Transaction>(transaction));

            return Ok(new { message = "Transaction successful", newBalance = senderWallet.Balance });
        }

        [HttpGet("recipients")]
        public async Task<ActionResult<IEnumerable<object>>> SearchRecipients(string query)
        {
            var users = await _context.Set<ApplicationUser>()
                .Where(u => u.FullName.ToLower().Contains(query.ToLower()))  // Convert both to lowercase
                .Include(u => u.Wallet)
                .ToListAsync();

            var recipientWallets = users.Select(u => new { u.FullName, u.Wallet.Id });
            return Ok(recipientWallets);
        }

    }
}
