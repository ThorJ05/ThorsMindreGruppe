using LinqToDB.Mapping;

namespace Infrastructure;

[Table("Listing")]
public class Listing
{
    [PrimaryKey, Identity] public int Id { get; set; }

    [Column, NotNull] public string Title { get; set; } = "";
    [Column] public string Description { get; set; } = "";

    [Column] public decimal Price { get; set; }
    [Column] public int Stock { get; set; }
    [Column] public int LowStockThreshold { get; set; }

    [Column] public bool IsActive { get; set; } = true;
    [Column] public bool IsOutOfStock { get; set; }

    [Column] public int? CategoryId { get; set; }
}