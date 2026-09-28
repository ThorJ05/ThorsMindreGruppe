using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddOpenApiDocument();
builder.Services.AddControllers();

var app = builder.Build();


app.MapControllers();
app.UseOpenApi();
app.UseSwaggerUi();


app.Run();

public class MyController : ControllerBase
{
    [HttpGet(nameof(DoSomething))]
    public void DoSomething()
    {
        
    }
}