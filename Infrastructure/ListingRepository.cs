using LinqToDB;
using LinqToDB.Async;

namespace Infrastructure;

public class ListingRepository : IListingRepository
{
    private readonly AppDb _db;
    public ListingRepository(AppDb db) => _db = db;

    public Task<List<Listing>> GetAllAsync() =>
        _db.Listings.ToListAsync();

    public Task<Listing?> GetByIdAsync(int id) =>
        _db.Listings.FirstOrDefaultAsync(l => l.Id == id);

    public Task<int> AddAsync(Listing listing) =>
        _db.InsertWithInt32IdentityAsync(listing);

    public Task UpdateAsync(Listing listing) =>
        _db.UpdateAsync(listing);

    public Task DeleteAsync(int id) =>
        _db.Listings.Where(l => l.Id == id).DeleteAsync();
}