using Infrastructure;
using Service.Dtos;

namespace Service;

public class ListingService : IListingService
{
    private readonly IListingRepository _repo;

    public ListingService(IListingRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<ListingDto>> GetAllAsync()
    {
        var listings = await _repo.GetAllAsync();
        return listings.Select(ToDto).ToList();
    }

    public async Task<ListingDto?> GetByIdAsync(int id)
    {
        var listing = await _repo.GetByIdAsync(id);
        return listing == null ? null : ToDto(listing);
    }

    public async Task<ListingDto> CreateAsync(ListingDto dto)
    {
        var listing = new Listing
        {
            Title = dto.Title,
            Description = dto.Description,
            Price = dto.Price,
            Stock = dto.Stock,
            LowStockThreshold = dto.LowStockThreshold,
            IsActive = true,
            IsOutOfStock = dto.Stock == 0,
            CategoryId = dto.CategoryId,
            ImageUrl = dto.ImageUrl,
        };

        listing.Id = await _repo.AddAsync(listing);
        return ToDto(listing);
    }

    public async Task<ListingDto?> UpdateAsync(int id, ListingDto dto)
    {
        var listing = await _repo.GetByIdAsync(id);
        if (listing == null) return null;

        listing.Title = dto.Title;
        listing.Description = dto.Description;
        listing.Price = dto.Price;
        listing.Stock = dto.Stock;
        listing.LowStockThreshold = dto.LowStockThreshold;
        listing.IsOutOfStock = dto.Stock == 0;
        listing.CategoryId = dto.CategoryId;
        listing.ImageUrl = dto.ImageUrl;

        await _repo.UpdateAsync(listing);
        return ToDto(listing);
    }

    public async Task<bool> SetActiveAsync(int id, bool active)
    {
        var listing = await _repo.GetByIdAsync(id);
        if (listing == null) return false;

        listing.IsActive = active;
        await _repo.UpdateAsync(listing);
        return true;
    }

    public async Task BulkUpdateAsync(List<int> ids, decimal? price, int? stock)
    {
        foreach (var id in ids)
        {
            var listing = await _repo.GetByIdAsync(id);
            if (listing == null) continue;

            if (price.HasValue)
                listing.Price = price.Value;

            if (stock.HasValue)
            {
                listing.Stock = stock.Value;
                listing.IsOutOfStock = stock.Value == 0;
            }

            await _repo.UpdateAsync(listing);
        }
    }

    public Task<int> DeleteSeizedAsync() =>
        _repo.DeleteSeizedAsync();

    private ListingDto ToDto(Listing l) =>
        new ListingDto
        {
            Id = l.Id,
            Title = l.Title,
            Description = l.Description,
            Price = l.Price,
            Stock = l.Stock,
            LowStockThreshold = l.LowStockThreshold,
            IsActive = l.IsActive,
            IsOutOfStock = l.IsOutOfStock,
            CategoryId = l.CategoryId,
            ImageUrl = l.ImageUrl,
        };
}