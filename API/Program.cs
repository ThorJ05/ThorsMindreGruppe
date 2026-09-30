using Infrastructure;
using LinqToDB;
using LinqToDB.AspNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Service;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApiDocument();
builder.Services.AddControllers();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddLinqToDBContext<AppDb>((provider, options) =>
    options.UseSQLite(
        builder.Configuration.GetConnectionString("Default")!
    ));

builder.Services.AddScoped<IListingRepository, ListingRepository>();

var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDb>();
    DatabaseInitializer.Initialize(db);
}


app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();


app.Run();

/*public class MyController : ControllerBase
{
    [HttpGet(nameof(DoSomething))]
    public void DoSomething()
    {
        
    } 
}*/