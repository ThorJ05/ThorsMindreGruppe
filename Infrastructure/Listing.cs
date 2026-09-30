using LinqToDB.Mapping;

namespace Infrastructure;

[Table("Listing")]
public class Listing
{
    [PrimaryKey, Identity] public int Id { get; set; }
    [Column, NotNull] public string Title { get; set; } = "";
    [Column, NotNull] public int CategoryId { get; set; }
}