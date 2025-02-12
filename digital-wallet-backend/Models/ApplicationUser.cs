using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace digital_wallet_backend.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [MaxLength(100)]
        public string FullName { get; set; } = string.Empty;

        [JsonIgnore]
        [ForeignKey("Wallet")]
        public string? WalletId { get; set; }  // Make WalletId nullable
        public Wallet Wallet { get; set; } // Wallet owned by the user
    }
}