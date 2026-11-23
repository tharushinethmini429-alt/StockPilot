using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Data;

namespace StockPilot.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AnalyticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AnalyticsController(ApplicationDbContext context)
    {
        _context = context;
    }

    //GET: api.Analytics/summary
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var totalProducts = await _context.Products.CountAsync();

        var totalCategories = await _context.Categories.CountAsync();

        var totalStockQuantity = await _context.Products
        .SumAsync(p => (int?)p.Quantity) ?? 0;

        var totalStockValue = await _context.Products
        .SumAsync(p => (decimal?)(p.Price * p.Quantity)) ?? 0;

        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;
        var lowStockCount = await _context.Products
        .CountAsync(p => p.Quantity > 0 &&
        p.Quantity <= lowStockThreshold);

        var outOfStockCount = await _context.Products
        .CountAsync(p => p.Quantity == 0);
 
        return Ok(new
        {
            totalProducts,
            totalCategories,
            totalStockQuantity,
            totalStockValue,
            lowStockCount,
            outOfStockCount
        });
    }

    //GET: api/Analytics/low-stock
    [HttpGet("low-stock")]
    public async Task<IActionResult> GetLowStockProducts()
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();
        var lowStockThreshold = settings?.LowStockThreshold ?? 5;
        var products = await _context.Products
        .Where(p => p.Quantity > 0 &&
        p.Quantity <= lowStockThreshold)
        .Select(p => new
        {
            p.Id,
            p.Name,
            p.SKU,
            p.Quantity,
            p.ReorderLevel
        })
        .ToListAsync();

    return Ok(products);
    }
    
    // GET: api/Analytics/out-of-stock
    [HttpGet("out-of-stock")]
    public async Task<IActionResult> GetOutOfStockProducts()
    {
        var products = await _context.Products
        .Where(p => p.Quantity == 0)
        .Select(p => new
        {
            p.Id,
            p.Name,
            p.SKU,
            p.Quantity,
            p.ReorderLevel
        })
        .ToListAsync();

    return Ok(products);
    }
    // GET: api/Analytics/category-summary
    [HttpGet("category-summary")]
    public async Task<IActionResult> GetCategorySummary()
    {
        var summary = await _context.Categories
        .Select(c => new
        {
            categoryId = c.Id,
            categoryName = c.Name,
            totalProducts = c.Products.Count(),
            totalStockQuantity = c.Products
            .Sum(p => (int?)p.Quantity) ?? 0,
            totalStockValue = c.Products
            .Sum(p => (decimal?)(p.Price * p.Quantity)) ?? 0
        })
        .ToListAsync();

    return Ok(summary);
}


}