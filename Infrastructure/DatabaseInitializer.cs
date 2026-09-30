using LinqToDB;

namespace Infrastructure;

public static class DatabaseInitializer
{
    public static void Initialize(AppDb db)
    {
        db.CreateTable<Category>(
            tableOptions: TableOptions.CreateIfNotExists);

        db.CreateTable<Listing>(
            tableOptions: TableOptions.CreateIfNotExists);
    }
}
