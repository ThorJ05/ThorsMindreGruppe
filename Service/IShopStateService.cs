using Service.Dtos;

namespace Service;

public interface IShopStateService
{
    Task<ShopStatsDto> GetStateAsync();
    Task ResetAsync();
}