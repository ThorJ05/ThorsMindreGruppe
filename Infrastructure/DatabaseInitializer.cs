using LinqToDB;

namespace Infrastructure;

public static class DatabaseInitializer
{
    public static void Initialize(AppDb db)
    {
        // Create tables if they don't exist. Never drop them —
        // doing so would wipe all saved listings and categories on every startup.
        db.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Listing>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Order>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<OrderItem>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<ShopState>(tableOptions: TableOptions.CreateIfNotExists);
        
        // Ensure the singleton ShopState row exits
        var state = db.ShopStates.FirstOrDefault(s => s.Id == 1);
        if (state == null)
            db.Insert(new ShopState { Id = 1, IsSeized = false });

    }
}