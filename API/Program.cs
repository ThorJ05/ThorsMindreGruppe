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

builder.Services.AddLinqToDBContext<AppDb>((provider, options) =>
    options.UseSQLite(
        builder.Configuration.GetConnectionString("Default")!
    ));

builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    DatabaseInitializer.Initialize(db);
}

app.UseCors();
app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();

app.Run();