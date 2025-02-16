using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using System.Transactions;
using digital_wallet_backend.Data;
using Microsoft.EntityFrameworkCore;

namespace digital_wallet_backend.Services {
public class DigitalWalletRepository<T> : IDigitalWallet<T> where T : class
{
    private readonly DigitalWalletDbContext _context;
    private readonly DbSet<T> _dbSet;

    public DigitalWalletRepository(DigitalWalletDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

 #region General Methods
       public async Task<IEnumerable<T>> GetAllAsync()
       {
           return await _dbSet.ToListAsync();
       }
   
   
   
       public async Task<T> GetByIdAsync(int id)
       {
           return await _dbSet.FindAsync(id);
       }
   
       public async Task<T> GetByParameterAsync<P>(P parameter)
       {
           return await _dbSet.FirstOrDefaultAsync(e => EF.Property<P>(e, "Id").Equals(parameter));
       }
   
       public async Task<T> GetByUserIdAsync(string userId)
       {
           return await _dbSet.FirstOrDefaultAsync(e => EF.Property<int>(e, "UserId").Equals(userId));
       }
   
       public async Task<T> CreateAsync(T entity)
       {
           await _dbSet.AddAsync(entity);
           await _context.SaveChangesAsync();
           return entity;
       }
   
       public async Task<T> UpdateAsync(int id, T entity)
       {
           _dbSet.Update(entity);
           await _context.SaveChangesAsync();
           return entity;
       }
   
       public async Task<bool> DeleteAsync(int id)
       {
           var entity = await _dbSet.FindAsync(id);
           if (entity == null) return false;
           
           _dbSet.Remove(entity);
           await _context.SaveChangesAsync();
           return true;
       }
 #endregion

 #region Special Methods

        public async Task<IEnumerable<digital_wallet_backend.Models.Transaction>> GetAllTransactionsWithReceiverWalletAsync(int senderId)
        {
            return await _context.Set<digital_wallet_backend.Models.Transaction>()
            .Where(t => t.SenderWalletId == senderId)
            //.Include(t => t.ReceiverWallet) // Assuming ReceiverWallet has a navigation property to User
                
            .ToListAsync();
        }

        public async Task<T> GetByParameterAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.FirstOrDefaultAsync(predicate);
        }

 #endregion
}
}
