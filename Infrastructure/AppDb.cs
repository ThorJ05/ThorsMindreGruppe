using LinqToDB;
using LinqToDB.Data;

namespace Infrastructure;

public class AppDb : DataConnection
{
    // Sets up the connection to the database
    public AppDb(DataOptions<AppDb> options) : base(options.Options) { }
    // Gives us access to the Category table
    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<Listing> Listings => this.GetTable<Listing>();
    public ITable<Order> Orders => this.GetTable<Order>();
    public ITable<OrderItem> OrderItems => this.GetTable<OrderItem>();
}