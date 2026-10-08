using Infrastructure;
using Service.Dtos;

namespace Service;

public class ShopStateService : IShopStateService
{
    private readonly IShopStateRepository _shop;
    private readonly IOrderRepository _orders;

    public ShopStateService(IShopStateRepository shop, IOrderRepository orders)
    {
        _shop = shop;
        _orders = orders;
    }

    public async Task<ShopStatsDto> GetStateAsync()
    {
        var state = await _shop.GetAsync();
        var completed = await _orders.CountCompletedAsync();

        return new ShopStatsDto
        {
            TotalOrders = completed,
            IsFeatured = completed > 100,
            IsSeized = state.IsSeized,
            SeizedAt = state.SeizedAt,
            SeizedReason = state.SeizedReason,
        };
    }

    public Task ResetAsync() => _shop.ResetAsync();
}