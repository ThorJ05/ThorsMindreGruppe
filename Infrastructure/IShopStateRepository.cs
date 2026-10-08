namespace Infrastructure;

public interface IShopStateRepository
{
    Task<ShopState> GetAsync();
    Task SetSeizedAsync(string reason);
    Task ResetAsync();
}