using Service.Dtos;

namespace Service;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<CategoryDto?> GetByIdAsync(int id);
    Task<CategoryDto> CreateAsync(CategoryDto category);
    Task<CategoryDto?> UpdateAsync(int id, CategoryDto category);
    Task<bool> SetActiveAsync(int id, bool isActive);
    Task<bool> SetRestrictedAsync(int id, bool isRestricted);
    Task<bool> CanVendorListAsync(int categoryId, int vendorSoldOrders);
    Task<(bool Success, string? Error)> DeleteAsync(int id, int? moveListingsToCategoryId);
}