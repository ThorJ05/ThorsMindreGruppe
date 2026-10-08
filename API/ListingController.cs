using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/listing")]
public class ListingController : ControllerBase
{
    private readonly IListingService _service;

    public ListingController(IListingService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<ListingDto>>> GetAll() =>
        Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ListingDto>> GetById(int id)
    {
        var listing = await _service.GetByIdAsync(id);
        return listing == null ? NotFound() : Ok(listing);
    }

    [HttpPost]
    public async Task<ActionResult<ListingDto>> Create(ListingDto dto)
    {
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ListingDto>> Update(int id, ListingDto dto)
    {
        var updated = await _service.UpdateAsync(id, dto);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpPatch("{id:int}/active")]
    public async Task<IActionResult> SetActive(int id, [FromBody] bool active)
    {
        var ok = await _service.SetActiveAsync(id, active);
        return ok ? NoContent() : NotFound();
    }

    [HttpPatch("bulk")]
    public async Task<IActionResult> BulkUpdate([FromBody] BulkUpdateRequest request)
    {
        await _service.BulkUpdateAsync(request.Ids, request.Price, request.Stock);
        return NoContent();
    }

    [HttpDelete("seized")]
    public async Task<ActionResult<int>> DeleteSeized()
    {
        var deleted = await _service.DeleteSeizedAsync();
        return Ok(deleted);
    }
}