using System.Linq.Expressions;

public interface IDigitalWallet<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync<E>(E id);
    Task<T> GetByIdAsync(int id);

    Task<T> GetByParameterAsync<P>(P parameter);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(int id, T entity);
    Task<bool> DeleteAsync(int id);
}
