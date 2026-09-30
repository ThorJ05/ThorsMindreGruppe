using Microsoft.AspNetCore.Mvc;
using Service;
using Service.Dtos;

namespace API;

[ApiController]
[Route("api/category")]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _service;

    public CategoryController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<CategoryDto>>> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetById(int id)
    {
        var category = await _service.GetByIdAsync(id);

        if (category == null)
            return NotFound();

        return Ok(category);
    }

    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(CategoryDto category)
    {
        var created = await _service.CreateAsync(category);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<CategoryDto>> Update(
        int id,
        CategoryDto category)
    {
        var updated = await _service.UpdateAsync(id, category);
        if (updated == null)
            return NotFound();

        return Ok(updated);
    }

    [HttpPatch("{id:int}/active")]
    public async Task<IActionResult> SetActive(
        int id,
        [FromBody] bool isActive)
    {
        var success = await _service.SetActiveAsync(id, isActive);
        if (!success)
            return NotFound();
        return NoContent();
    }

    [HttpPatch("{id:int}/restricted")]
    public async Task<IActionResult> SetRestricted(
        int id,
        [FromBody] bool isRestricted)
    {
        var success = await _service.SetRestrictedAsync(id, isRestricted);
        if (!success)
            return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] int? moveListingsToCategoryId)
    {
        var (success, error) = await _service.DeleteAsync(id, moveListingsToCategoryId);
        if (!success)
            return BadRequest(error);
        return NoContent();
    }
}