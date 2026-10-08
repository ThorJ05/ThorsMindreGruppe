namespace Service.Dtos;

public class OrderItemDto
{
    public int Id { get; set; }
    public int ListingId { get; set; }
    public string ListingTitle { get; set; } = "";
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string Status { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public decimal Subtotal { get; set; }
    public decimal Discount { get; set; }
    public decimal Total { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
}

public class CheckoutItemRequest
{
    public int ListingId { get; set; }
    public int Quantity { get; set; }
}

public class CheckoutRequest
{
    public List<CheckoutItemRequest> Items { get; set; } = new();
}

public class CheckoutResultDto
{
    public OrderDto Order { get; set; } = new();
    public bool Raided { get; set; }
    public bool DiscountApplied { get; set; }
    public decimal DiscountAmount { get; set; }
}

public class ShopStatsDto
{
    public int TotalOrders { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsSeized { get; set; }
    public DateTime? SeizedAt { get; set; }
    public string? SeizedReason { get; set; }
}