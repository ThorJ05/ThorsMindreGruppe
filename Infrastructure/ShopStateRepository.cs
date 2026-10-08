using LinqToDB;
using LinqToDB.Async;

namespace Infrastructure;

public class ShopStateRepository : IShopStateRepository
{
    private readonly AppDb _db;
    public ShopStateRepository(AppDb db) => _db = db;

    public async Task<ShopState> GetAsync()
    {
        var state = await _db.ShopStates.FirstOrDefaultAsync(s => s.Id == 1);
        if (state == null)
        {
            state = new ShopState { Id = 1, IsSeized = false };
            await _db.InsertAsync(state);
        }
        return state;
    }

    public Task SetSeizedAsync(string reason) =>
        _db.ShopStates
            .Where(s => s.Id == 1)
            .Set(s => s.IsSeized, true)
            .Set(s => s.SeizedAt, DateTime.UtcNow)
            .Set(s => s.SeizedReason, reason)
            .UpdateAsync();

    public Task ResetAsync() =>
        _db.ShopStates
            .Where(s => s.Id == 1)
            .Set(s => s.IsSeized, false)
            .Set(s => s.SeizedAt, (DateTime?)null)
            .Set(s => s.SeizedReason, (string?)null)
            .UpdateAsync();
}