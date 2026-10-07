using LinqToDB;
using LinqToDB.Async;
using LinqToDB.Data;

namespace Infrastructure;

public class OrderRepository : IOrderRepository
{
    private readonly AppDb _db;
    public OrderRepository(AppDb db) => _db = db;

    public Task<List<Order>> GetAllAsync() =>
        _db.Orders.OrderByDescending(o => o.CreatedAt).ToListAsync();

    public Task<Order?> GetByIdAsync(int id) =>
        _db.Orders.FirstOrDefaultAsync(o => o.Id == id);

    public Task<List<OrderItem>> GetItemsByOrderIdAsync(int orderId) =>
        _db.OrderItems.Where(i => i.OrderId == orderId).ToListAsync();

    public async Task<int> CreateOrderAsync(Order order, List<OrderItem> items)
    {
        await using var transaction = await _db.BeginTransactionAsync();

        var orderId = await _db.InsertWithInt32IdentityAsync(order);

        foreach (var item in items)
        {
            item.OrderId = orderId;
            await _db.InsertAsync(item);
        }

        await transaction.CommitAsync();
        return orderId;
    }
}