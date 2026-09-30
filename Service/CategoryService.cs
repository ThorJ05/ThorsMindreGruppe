using Infrastructure;
using Service.Dtos;

namespace Service;

public class CategoryService : ICategoryService
{
    // Used to access the category and listing repositories
    private readonly ICategoryRepository _repository;
    private readonly IListingRepository _listingRepository;

    public CategoryService(ICategoryRepository repository, IListingRepository listingRepository)
    {
        _repository = repository;
        _listingRepository = listingRepository;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(category => new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder,
            IsRestricted = category.IsRestricted,
            MinSoldOrders = category.MinSoldOrders,
        }).ToList();
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category == null)
            return null;

        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder,
            IsRestricted = category.IsRestricted,
            MinSoldOrders = category.MinSoldOrders,
        };
    }

    public async Task<CategoryDto> CreateAsync(CategoryDto category)
    {
        var newCategory = new Category
        {
            Name = category.Name,
            ParentCategoryId = category.ParentCategoryId,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder,
            IsRestricted = category.IsRestricted,
            MinSoldOrders = category.MinSoldOrders,
        };

        var id = await _repository.AddAsync(newCategory);

        category.Id = id;
        return category;
    }

    public async Task<CategoryDto?> UpdateAsync(int id, CategoryDto category)
    {
        var existingCategory = await _repository.GetByIdAsync(id);

        if (existingCategory == null)
            return null;

        existingCategory.Name = category.Name;
        existingCategory.ParentCategoryId = category.ParentCategoryId;
        existingCategory.IsActive = category.IsActive;
        existingCategory.SortOrder = category.SortOrder;
        existingCategory.IsRestricted = category.IsRestricted;
        existingCategory.MinSoldOrders = category.MinSoldOrders;

        await _repository.UpdateAsync(existingCategory);

        return new CategoryDto
        {
            Id = existingCategory.Id,
            Name = existingCategory.Name,
            ParentCategoryId = existingCategory.ParentCategoryId,
            IsActive = existingCategory.IsActive,
            SortOrder = existingCategory.SortOrder,
            IsRestricted = existingCategory.IsRestricted,
            MinSoldOrders = existingCategory.MinSoldOrders
        };
    }

    public async Task<bool> SetActiveAsync(int id, bool isActive)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category == null)
            return false;

        category.IsActive = isActive;

        await _repository.UpdateAsync(category);

        return true;
    }

    public async Task<bool> SetRestrictedAsync(int id, bool isRestricted)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category == null)
            return false;

        category.IsRestricted = isRestricted;

        await _repository.UpdateAsync(category);

        return true;
    }

    // Checks whether a vendor is allowed to list in a (possibly restricted) category
    public async Task<bool> CanVendorListAsync(int categoryId, int vendorSoldOrders)
    {
        var category = await _repository.GetByIdAsync(categoryId);
        if (category == null) return false;
        if (!category.IsRestricted) return true;
        return vendorSoldOrders >= (category.MinSoldOrders ?? 0);
    }

    // Deletes a category. If it still has listings, they must be moved to
    // another category first via moveListingsToCategoryId.
    public async Task<(bool Success, string? Error)> DeleteAsync(int id, int? moveListingsToCategoryId)
    {
        var category = await _repository.GetByIdAsync(id);
        if (category == null)
            return (false, "Category not found.");

        var listingCount = await _listingRepository.CountByCategoryAsync(id);

        if (listingCount > 0)
        {
            if (moveListingsToCategoryId == null)
                return (false, $"Category has {listingCount} listing(s). Provide moveListingsToCategoryId.");

            var target = await _repository.GetByIdAsync(moveListingsToCategoryId.Value);
            if (target == null)
                return (false, "Target category not found.");

            await _listingRepository.MoveCategoryAsync(id, moveListingsToCategoryId.Value);
        }

        await _repository.DeleteAsync(id);
        return (true, null);
    }
}