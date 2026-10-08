using Infrastructure;
using Service.Dtos;

namespace Service;

public class OrderService : IOrderService
{
    private const int DiscountThreshold = 10;
    private const decimal DiscountRate = 0.20m;
    private const double FbiRaidChance = 1.00;

    private readonly IOrderRepository _orderRepo;
    private readonly IListingRepository _listingRepo;
    private readonly IShopStateRepository _shopRepo;

    public OrderService(
        IOrderRepository orderRepo,
        IListingRepository listingRepo,
        IShopStateRepository shopRepo)
    {
        _orderRepo = orderRepo;
        _listingRepo = listingRepo;
        _shopRepo = shopRepo;
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

    public async Task<(bool Success, string? Error, CheckoutResultDto, OrderDto? Order)> CheckoutAsync(
        CheckoutRequest request)
    {
        if (request.Items.Count == 0)
            return (false, "Cart is empty Brother.", new CheckoutResultDto(), null);

        // --- Validate everything before writing anything ---
        var orderItems = new List<OrderItem>();
        decimal subtotal = 0;

        foreach (var line in request.Items)
        {
            var listing = await _listingRepo.GetByIdAsync(line.ListingId);
            if (listing == null)
                return (false, $"Listing {line.ListingId} not found Brother.", new CheckoutResultDto(), null);

            // Seized listings can't be purchased.
            if (!listing.IsActive)
                return (false, $"'{listing.Title}' has been seized by Adeptus Arbites.", new CheckoutResultDto(),
                    null);

            if (line.Quantity <= 0)
                return (false, $"Invalid quantity for listing Brother {line.ListingId}.", new CheckoutResultDto(), null);

            if (listing.Stock < line.Quantity)
                return (false, $"Not enough stock for '{listing.Title}'.", new CheckoutResultDto(), null);

            orderItems.Add(new OrderItem
            {
                ListingId = listing.Id,
                Quantity = line.Quantity,
                UnitPrice = listing.Price,
            });

            subtotal += listing.Price * line.Quantity;
        }

        // --- Story 1: loyalty discount (10+ prior orders → 20% off) ---
        var priorOrderCount = await _orderRepo.CountAsync();
        bool discountApplied = priorOrderCount > DiscountThreshold;
        decimal discount = discountApplied
            ? Math.Round(subtotal * DiscountRate, 2)
            : 0m;

        decimal total = subtotal - discount;

        // --- Save the order ---
        var order = new Order
        {
            Status = "Completed",
            CreatedAt = DateTime.UtcNow,
            Subtotal = subtotal,
            Discount = discount,
            Total = total,
        };

        var orderId = await _orderRepo.CreateOrderAsync(order, orderItems);

        // --- Decrement stock for each listing ---
        foreach (var line in request.Items)
        {
            var listing = await _listingRepo.GetByIdAsync(line.ListingId);
            if (listing == null) continue;

            listing.Stock -= line.Quantity;
            listing.IsOutOfStock = listing.Stock <= 0;
            await _listingRepo.UpdateAsync(listing);
        }

        // --- Story 3: FBI raid (1% chance per checkout) ---
        bool raided = false;
        if (_random.NextDouble() < FbiRaidChance)
        {
            raided = true;
            await _listingRepo.DeactivateAllAsync();
            await _shopRepo.SetSeizedAsync("Adeptus Arbites raid triggered by transaction pattern.");
        }

        var createdOrder = await _orderRepo.GetByIdAsync(orderId);
        var dto = createdOrder == null ? null : await ToDto(createdOrder);

        var result = new CheckoutResultDto
        {
            Order = dto!,
            Raided = raided,
            DiscountApplied = discountApplied,
            DiscountAmount = discount,
        };

        return (true, null, result, dto);
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
            Subtotal = order.Subtotal,
            Discount = order.Discount,
            Total = order.Total,
            Items = itemDtos,
        };
    }
    private readonly IRandomProvider _random;

    public OrderService(
        IOrderRepository orderRepo,
        IListingRepository listingRepo,
        IShopStateRepository shopRepo,
        IRandomProvider random)
    {
        _orderRepo = orderRepo;
        _listingRepo = listingRepo;
        _shopRepo = shopRepo;
        _random = random;
    }
}