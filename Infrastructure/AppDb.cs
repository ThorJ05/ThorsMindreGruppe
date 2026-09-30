using LinqToDB;
using LinqToDB.Data;

namespace Infrastructure;

public class AppDb : DataConnection
{
    public AppDb(DataOptions<AppDb> options) : base(options.Options) { }

    public ITable<Category> Categories => this.GetTable<Category>();
    public ITable<Listing> Listings => this.GetTable<Listing>();   // ← Tilføj denne
}