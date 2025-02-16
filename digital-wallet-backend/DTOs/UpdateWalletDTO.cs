using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace digital_wallet_backend.Models
{
 public class UpdateWalletDTO
    {

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Balance { get; set; }

        [JsonIgnore] 
        public ICollection<Transaction> Transactions { get; set; } // Payments made
    }
}