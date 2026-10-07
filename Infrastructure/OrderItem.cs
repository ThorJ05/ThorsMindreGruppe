using LinqToDB.Mapping;

namespace Infrastructure;

[Table("OrderItem")]
public class OrderItem
{
    [PrimaryKey, Identity] public int Id { get; set; }
    [Column, NotNull] public int OrderId { get; set; }
    [Column, NotNull] public int ListingId { get; set; }
    [Column, NotNull] public int Quantity { get; set; }
    [Column, NotNull] public decimal UnitPrice { get; set; }
}