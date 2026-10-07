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