using LinqToDB.Mapping;

namespace Infrastructure;

[Table("Listing")]
public class Listing
{
    [PrimaryKey, Identity] public int Id { get; set; }
    [Column, NotNull] public string Title { get; set; } = "";
    [Column] public string? Description { get; set; }
    [Column, NotNull] public decimal Price { get; set; }
    [Column, NotNull] public int Stock { get; set; }
    [Column] public int? LowStockThreshold { get; set; }
    [Column, NotNull] public bool IsActive { get; set; } = true;
    [Column, NotNull] public bool IsOutOfStock { get; set; }
    [Column, NotNull] public int CategoryId { get; set; }
}