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
    }
}