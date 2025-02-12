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

            // One ApplicationUser has one Wallet (1-to-1)
            modelBuilder.Entity<Wallet>()
                .HasOne(w => w.User)
                .WithOne(u => u.Wallet)  // Ensure ApplicationUser has a Wallet navigation property
                .HasForeignKey<Wallet>(w => w.UserId)
                .IsRequired();  // The relationship is required


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
