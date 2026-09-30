using LinqToDB.Mapping;

namespace Infrastructure;

[Table("Category")]
public class Category
{
    // Unique ID for the category
    [PrimaryKey, Identity] public int Id { get; set; }
    //Name shown for the categoru
    [Column, NotNull] public string Name { get; set; } = "";
    // Used if the category belongs under another category
    [Column] public int? ParentCategoryId { get; set; }
    // Used to disable a category without deleting it
    [Column] public bool IsActive { get; set; } = true;
    // Controls the order of the categories
    [Column] public int SortOrder { get; set; }
    [Column] public bool IsRestricted { get; set; } = false;
    // Minimum amount of sold orders needed for the category
    [Column] public int? MinSoldOrders { get; set; }    
}
