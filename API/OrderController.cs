using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/order")]
public class OrderController : ControllerBase
{
    private readonly IOrderService _service;

    public OrderController(IOrderService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<OrderDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<OrderDto>> GetById(int id)
    {
        var order = await _service.GetByIdAsync(id);

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<OrderDto>> Checkout(CheckoutRequest request)
    {
        var (success, error, order) = await _service.CheckoutAsync(request);

        if (!success)
            return BadRequest(error);

        return CreatedAtAction(nameof(GetById), new { id = order!.Id }, order);
    }
}