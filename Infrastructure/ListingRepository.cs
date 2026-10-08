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

    public async Task UpdateAsync(Listing listing) =>
        await _db.UpdateAsync(listing);

    public Task<int> CountByCategoryAsync(int categoryId) =>
        _db.Listings.Where(l => l.CategoryId == categoryId).CountAsync();

    public Task MoveCategoryAsync(int fromCategoryId, int toCategoryId) =>
        _db.Listings.Where(l => l.CategoryId == fromCategoryId)
            .Set(l => l.CategoryId, toCategoryId)
            .UpdateAsync();

    public Task DeactivateAllAsync() =>
        _db.Listings
            .Set(l => l.IsActive, false)
            .UpdateAsync();

    public Task<int> DeleteSeizedAsync() =>
        _db.Listings
            .Where(l => l.IsActive == false)
            .DeleteAsync();
}