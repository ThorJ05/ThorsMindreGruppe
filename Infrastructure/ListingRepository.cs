using LinqToDB;
using LinqToDB.Async;

namespace Infrastructure;

public class ListingRepository : IListingRepository
{
    private readonly AppDb _db;
    public ListingRepository(AppDb db) => _db = db;

    public Task<int> CountByCategoryAsync(int categoryId) =>
        _db.Listings.Where(l => l.CategoryId == categoryId).CountAsync();

    public Task MoveCategoryAsync(int fromCategoryId, int toCategoryId) =>
        _db.Listings.Where(l => l.CategoryId == fromCategoryId)
            .Set(l => l.CategoryId, toCategoryId)
            .UpdateAsync();
}