using LinqToDB.Mapping;

namespace Infrastructure;

[Table("Order")]
public class Order
{
    [PrimaryKey, Identity] public int Id { get; set; }
    [Column, NotNull] public string Status { get; set; } = "Pending";
    [Column, NotNull] public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    [Column, NotNull] public decimal Subtotal { get; set; }
    [Column, NotNull] public decimal Discount { get; set; }
    [Column, NotNull] public decimal Total { get; set; }
}