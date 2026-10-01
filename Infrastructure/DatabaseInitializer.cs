using LinqToDB;

namespace Infrastructure;

public static class DatabaseInitializer
{
    public static void Initialize(AppDb db)
    {
        // Dev-only: drop and recreate so schema changes always take effect.
        // Remove this block once you have real data you want to keep.
        db.DropTable<Category>(throwExceptionIfNotExists: false);
        db.DropTable<Listing>(throwExceptionIfNotExists: false);

        db.CreateTable<Category>(tableOptions: TableOptions.CreateIfNotExists);
        db.CreateTable<Listing>(tableOptions: TableOptions.CreateIfNotExists);
    }
}