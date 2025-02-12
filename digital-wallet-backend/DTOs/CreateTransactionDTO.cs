using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace digital_wallet_backend.DTOs
{
    public class CreateTransactionDTO
        {
            [Required]
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