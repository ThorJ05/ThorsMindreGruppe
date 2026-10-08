namespace Infrastructure;

public interface IListingRepository
{
    Task<List<Listing>> GetAllAsync();
    Task<Listing?> GetByIdAsync(int id);
    Task<int> AddAsync(Listing listing);
    Task UpdateAsync(Listing listing);
    Task<int> CountByCategoryAsync(int categoryId);
    Task MoveCategoryAsync(int fromCategoryId, int toCategoryId);
    Task DeactivateAllAsync();
    Task<int> DeleteSeizedAsync();
}