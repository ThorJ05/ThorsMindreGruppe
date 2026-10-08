namespace Infrastructure;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<List<OrderItem>> GetItemsByOrderIdAsync(int orderId);
    Task<int> CreateOrderAsync(Order order, List<OrderItem> items);
    Task<int> CountAsync();
    Task<int> CountCompletedAsync();
}