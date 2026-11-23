using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Data;
using StockPilot.Api.Models;
using StockPilot.Api.DTOs;

namespace StockPilot.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    //Get: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories.ToListAsync();

        return Ok(categories);
    }

    //GET: api/categories/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Category>> GetCategory(int id)
    {
        var category = await _context.Categories
        .FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }
        return Ok(category);
    }

    //POST: api/categories
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(
        CreateCategoryDto categoryDto)
    {
        var category = new Category
        {
            Name = categoryDto.Name
        };
        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = category.Id },
            category);
    }

    //PUT: api/categories/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        UpdateCategoryDto categoryDto)

    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null )
        {
            return NotFound();
        }
        category.Name = categoryDto.Name;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories.FindAsync(id);
        
        if (category == null)
        {
            return NotFound();
        }

        var hasProducts = await _context.Products
        .AnyAsync(p => p.CategoryId == id);
        
        if (hasProducts)
        {
            return Conflict("Cannot delete a category that contains products.");
        }
        
        _context.Categories.Remove(category);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    

}