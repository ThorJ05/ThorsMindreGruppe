using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure;

public interface IListingRepository
{
    Task<List<Listing>> GetAllAsync();
    Task<Listing?> GetByIdAsync(int id);
    Task<int> AddAsync(Listing listing);
    Task UpdateAsync(Listing listing);
    Task DeleteAsync(int id);
}