using System.ComponentModel.DataAnnotations;

namespace digital_wallet_backend.Models.Account
{
    public class LoginModel
    {
        [Required(ErrorMessage = "Phone number is required")]
        [Phone(ErrorMessage = "Invalid phone number format")]
        public string? PhoneNumber { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
 
    }
}