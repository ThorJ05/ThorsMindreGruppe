using LinqToDB;
using LinqToDB.Async;

namespace Infrastructure;

public class CategoryRepository : ICategoryRepository
{
    // Database connection
    private readonly AppDb _db;
    public CategoryRepository(AppDb db) => _db = db;
    // Gets all categories and sorts them
    public Task<List<Category>> GetAllAsync() =>
        _db.Categories.OrderBy(c => c.SortOrder).ThenBy(c => c.Name).ToListAsync();
    // Finds a category by its ID
    public Task<Category?> GetByIdAsync(int id) =>
        _db.Categories.FirstOrDefaultAsync(c => c.Id == id);

    // Adds a new category and gets its new ID
    public Task<int> AddAsync(Category category) =>
        _db.InsertWithInt32IdentityAsync(category);
    
    // Updates a category
    public async Task UpdateAsync(Category category) =>
        await _db.UpdateAsync(category);
    
    // Deletes a category by its ID
    public async Task DeleteAsync(int id) =>
        await _db.Categories.Where(c => c.Id == id).DeleteAsync();
}