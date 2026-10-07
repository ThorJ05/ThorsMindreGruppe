using Infrastructure;
using LinqToDB;
using LinqToDB.AspNet;
using Service;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApiDocument();
builder.Services.AddControllers();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<IListingService, ListingService>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();

builder.Services.AddLinqToDBContext<AppDb>((provider, options) =>
    options.UseSQLite(
        builder.Configuration.GetConnectionString("Default")!
    ));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    DatabaseInitializer.Initialize(db);
}

app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();

// Friendly startup banner so it's obvious where to open the app.
Console.WriteLine();
Console.WriteLine("  ------------------------------------------------------------");
Console.WriteLine("   API is running.");
Console.WriteLine("   Open the app at  ->  http://localhost:8080");
Console.WriteLine("   Swagger UI      ->  http://localhost:8080/swagger");
Console.WriteLine("  ------------------------------------------------------------");
Console.WriteLine();

app.Run();