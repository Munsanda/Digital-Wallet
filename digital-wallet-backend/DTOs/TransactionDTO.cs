using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace digital_wallet_backend.DTOs
{
    public class TransactionDTO
        {
            [Required]
            [JsonIgnore]
            [ForeignKey("SenderWallet")]
            public int SenderWalletId { get; set; }

            [Required]
            [ForeignKey("ReceiverWallet")]
            public int ReceiverWalletId { get; set; }

            [Required]
            [MaxLength(100)]
            public string Description { get; set; } = "Money for ";

            [Required]
            [Column(TypeName = "decimal(18,2)")]
            public decimal Amount { get; set; }

            [Required]
            public DateTime Timestamp { get; set; }
    }
}