using LinqToDB.Mapping;

namespace Infrastructure;

[Table("ShopState")]
public class ShopState
{
    [PrimaryKey] public int Id { get; set; } = 1;
    [Column, NotNull] public bool IsSeized { get; set; } = false;
    [Column] public DateTime? SeizedAt { get; set; }
    [Column] public string? SeizedReason { get; set; }
}