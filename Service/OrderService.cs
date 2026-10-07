using Infrastructure;
using Service.Dtos;

namespace Service;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepo;
    private readonly IListingRepository _listingRepo;

    public OrderService(IOrderRepository orderRepo, IListingRepository listingRepo)
    {
        _orderRepo = orderRepo;
        _listingRepo = listingRepo;
    }

    public async Task<List<OrderDto>> GetAllAsync()
    {
        var orders = await _orderRepo.GetAllAsync();
        var result = new List<OrderDto>();

        foreach (var order in orders)
            result.Add(await ToDto(order));

        return result;
    }

    public async Task<OrderDto?> GetByIdAsync(int id)
    {
        var order = await _orderRepo.GetByIdAsync(id);
        return order == null ? null : await ToDto(order);
    }

    public async Task<(bool Success, string? Error, OrderDto? Order)> CheckoutAsync(CheckoutRequest request)
    {
        if (request.Items.Count == 0)
            return (false, "Cart is empty.", null);

        var orderItems = new List<OrderItem>();
        decimal total = 0;

        // Validate stock for every line before changing anything.
        foreach (var line in request.Items)
        {
            var listing = await _listingRepo.GetByIdAsync(line.ListingId);
            if (listing == null)
                return (false, $"Listing {line.ListingId} not found.", null);

            if (line.Quantity <= 0)
                return (false, $"Invalid quantity for listing {line.ListingId}.", null);

            if (listing.Stock < line.Quantity)
                return (false, $"Not enough stock for '{listing.Title}'.", null);

            orderItems.Add(new OrderItem
            {
                ListingId = listing.Id,
                Quantity = line.Quantity,
                UnitPrice = listing.Price,
            });

            total += listing.Price * line.Quantity;
        }

        var order = new Order
        {
            Status = "Completed",
            CreatedAt = DateTime.UtcNow,
            Total = total,
        };

        var orderId = await _orderRepo.CreateOrderAsync(order, orderItems);

        // Decrement stock for each listing now that the order is placed.
        foreach (var line in request.Items)
        {
            var listing = await _listingRepo.GetByIdAsync(line.ListingId);
            if (listing == null) continue;

            listing.Stock -= line.Quantity;
            listing.IsOutOfStock = listing.Stock <= 0;
            await _listingRepo.UpdateAsync(listing);
        }

        var createdOrder = await _orderRepo.GetByIdAsync(orderId);
        var dto = createdOrder == null ? null : await ToDto(createdOrder);

        return (true, null, dto);
    }

    private async Task<OrderDto> ToDto(Order order)
    {
        var items = await _orderRepo.GetItemsByOrderIdAsync(order.Id);
        var itemDtos = new List<OrderItemDto>();

        foreach (var item in items)
        {
            var listing = await _listingRepo.GetByIdAsync(item.ListingId);
            itemDtos.Add(new OrderItemDto
            {
                Id = item.Id,
                ListingId = item.ListingId,
                ListingTitle = listing?.Title ?? "(deleted listing)",
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
            });
        }

        return new OrderDto
        {
            Id = order.Id,
            Status = order.Status,
            CreatedAt = order.CreatedAt,
            Total = order.Total,
            Items = itemDtos,
        };
    }
}