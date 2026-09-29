using Infrastructure;
using Service.Dtos;

namespace Service;

public class CategoryService : ICategoryService
{
    // Used to access the category repository
    private readonly ICategoryRepository _repository;

    // Gets all categories
    public CategoryService(ICategoryRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        var categories = await _repository.GetAllAsync();
        return categories.Select(category => new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            ParentCategoryId =  category.ParentCategoryId,
            IsActive = category.IsActive,
            SortOrder = category.SortOrder,
            MinSoldOrders =  category.MinSoldOrders,
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
        existingCategory.MinSoldOrders = category.MinSoldOrders;

        await _repository.UpdateAsync(existingCategory);

        return new CategoryDto
        {
            Id = existingCategory.Id,
            Name = existingCategory.Name,
            ParentCategoryId = existingCategory.ParentCategoryId,
            IsActive = existingCategory.IsActive,
            SortOrder = existingCategory.SortOrder,
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

    public async Task<bool> DeleteAsync(int id)
    {
        var category = await _repository.GetByIdAsync(id);

        if (category == null)
            return false;

        await _repository.DeleteAsync(id);

        return true;
    }
}