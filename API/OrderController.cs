using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/order")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _service;
    private readonly IShopStateService _shop;

    public OrderController(IOrderService service, IShopStateService shop)
    {
        _service = service;
        _shop = shop;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await _service.GetByIdAsync(id);
        return order == null ? NotFound() : Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<CheckoutResultDto>> Checkout(CheckoutRequest request)
    {
        var (success, error, result, _) = await _service.CheckoutAsync(request);
        if (!success) return BadRequest(new { error });   // ← wrap in object
        return Ok(result);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ShopStatsDto>> GetStats()
        => Ok(await _shop.GetStateAsync());

    [HttpPost("reset-seizure")]
    public async Task<IActionResult> ResetSeizure()
    {
        await _shop.ResetAsync();
        return NoContent();
    }
}