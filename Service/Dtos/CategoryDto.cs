namespace Service.Dtos;

public class CategoryDto
{
    public int Id { get; set;}
    public string Name { get; set;} = "";
    public int? ParentCategoryId { get; set;}
    public bool IsActive { get; set;}
    public int SortOrder { get; set;}
    public bool IsRestricted { get; set; }
    public int? MinSoldOrders { get; set;}
}