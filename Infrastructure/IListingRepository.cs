namespace Infrastructure;

public interface IListingRepository
{
    Task<int> CountByCategoryAsync(int categoryId);
    Task MoveCategoryAsync(int fromCategoryId, int toCategoryId);
}