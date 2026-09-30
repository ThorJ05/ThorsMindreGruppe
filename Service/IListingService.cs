using Service.Dtos;

namespace Service;

public interface IListingService
{
    Task<List<ListingDto>> GetAllAsync();
    Task<ListingDto?> GetByIdAsync(int id);
    Task<ListingDto> CreateAsync(ListingDto dto);
    Task<ListingDto?> UpdateAsync(int id, ListingDto dto);
    Task<bool> SetActiveAsync(int id, bool active);
    Task BulkUpdateAsync(List<int> ids, decimal? price, int? stock);
}