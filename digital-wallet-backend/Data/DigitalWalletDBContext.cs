using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using digital_wallet_backend.Models;

namespace digital_wallet_backend.Data
{
    public class DigitalWalletDbContext : IdentityDbContext<ApplicationUser>
    {

        public DigitalWalletDbContext(DbContextOptions<DigitalWalletDbContext> options)
            : base(options)
        {
        }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Wallet> Wallets { get; set; }

        // Optionally, you can override OnModelCreating to configure relationships or constraints
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

           base.OnModelCreating(modelBuilder);

            // One ApplicationUser has many Wallets (1-to-many)
            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithMany()
                .HasForeignKey(w => w.UserId)
                .IsRequired();

            // One Wallet can have many Transactions as Sender
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.SenderWallet)
                .WithMany()
                .HasForeignKey(t => t.SenderWalletId)
                .OnDelete(DeleteBehavior.Restrict);  // Prevents cascade delete

            // One Wallet can have many Transactions as Receiver
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.ReceiverWallet)
                .WithMany()
                .HasForeignKey(t => t.ReceiverWalletId)
                .OnDelete(DeleteBehavior.Restrict);  // Prevents cascade deleteThe relationship is required (Optional if needed)
        }
    }
}
