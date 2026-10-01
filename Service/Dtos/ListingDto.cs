namespace Service.Dtos;

public class ListingDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int? LowStockThreshold { get; set; }
    public bool IsActive { get; set; }
    public bool IsOutOfStock { get; set; }
    public int CategoryId { get; set; }
}