using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Data;
using StockPilot.Api.DTOs;
using StockPilot.Api.Models;

namespace StockPilot.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductResponseDto>>> GetProducts()
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;
        
        var products = await _context.Products
            .Include(p => p.Category)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Price = p.Price,
                Quantity = p.Quantity,
                ReorderLevel = p.ReorderLevel,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                IsLowStock = p.Quantity > 0 && p.Quantity <= lowStockThreshold
            })
            .ToListAsync();

        return Ok(products);
    }

    // GET: api/products/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProductResponseDto>> GetProduct(int id)
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;
        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id)
            .Select(p => new ProductResponseDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Price = p.Price,
                Quantity = p.Quantity,
                ReorderLevel = p.ReorderLevel,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                IsLowStock = p.Quantity > 0 && p.Quantity <= lowStockThreshold
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }

        // POST: api/products
    [HttpPost]
    public async Task<ActionResult<ProductResponseDto>> CreateProduct(
        CreateProductDto productDto)
    {
    var category = await _context.Categories
        .FindAsync(productDto.CategoryId);

        if (category == null)
        {
            return BadRequest("Invalid CategoryId.");
        }

        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;

        var skuExists = await _context.Products
        .AnyAsync(p => p.SKU == productDto.SKU);

        if (skuExists)
        {
            return Conflict("A product with this SKU already exist.");
        }

        var product = new Product
        {
            Name = productDto.Name,
            SKU = productDto.SKU,
            Price = productDto.Price,
            Quantity = productDto.Quantity,
            ReorderLevel = productDto.ReorderLevel,
            CategoryId = productDto.CategoryId
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        var response = new ProductResponseDto
        {
            Id = product.Id,
            Name = product.Name,
            SKU = product.SKU,
            Price = product.Price,
            Quantity = product.Quantity,
            ReorderLevel = product.ReorderLevel,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            IsLowStock = product.Quantity > 0 && product.Quantity <= lowStockThreshold
        };

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            response);
    }

        // PUT: api/products/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        UpdateProductDto productDto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;

        var category = await _context.Categories
            .FindAsync(productDto.CategoryId);

        if (category == null)
        {
            return BadRequest("Invalid CategoryId.");
        }

        var skuExists = await _context.Products
        .AnyAsync(p => p.SKU == productDto.SKU && p.Id != id);

        if (skuExists)
        {
            return Conflict("Another product with this SKU already exists.");
        }

        product.Name = productDto.Name;
        product.SKU = productDto.SKU;
        product.Price = productDto.Price;
        product.Quantity = productDto.Quantity;
        product.ReorderLevel = productDto.ReorderLevel;
        product.CategoryId = productDto.CategoryId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/products/5
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteProduct(int id)
{
    var product = await _context.Products.FindAsync(id);

    if (product == null)
    {
        return NotFound();
    }

    _context.Products.Remove(product);

    await _context.SaveChangesAsync();

    return NoContent();
}
}
