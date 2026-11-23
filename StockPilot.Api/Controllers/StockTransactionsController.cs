using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Data;
using StockPilot.Api.DTOs;
using StockPilot.Api.Models;

namespace StockPilot.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class StockTransactionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StockTransactionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/StockTransactions
    [HttpPost]
    public async Task<IActionResult> CreateTransaction(
        CreateStockTransactionDto transactionDto)
    {
        var product = await _context.Products
            .FindAsync(transactionDto.ProductId);

        if (product == null)
        {
            return NotFound("Product not found.");
        }

        if (transactionDto.Type != "Stock In" &&
            transactionDto.Type != "Stock Out")
        {
            return BadRequest("Type must be Stock In or Stock Out.");
        }

        if (transactionDto.Type == "Stock Out" &&
            product.Quantity < transactionDto.Quantity)
        {
            return BadRequest("Insufficient stock available.");
        }

        if (transactionDto.Type == "Stock In")
        {
            product.Quantity += transactionDto.Quantity;
        }
        else
        {
            product.Quantity -= transactionDto.Quantity;
        }

        var transaction = new StockTransaction
        {
            ProductId = transactionDto.ProductId,
            Type = transactionDto.Type,
            Quantity = transactionDto.Quantity,
            Note = transactionDto.Note,
            TransactionDate = DateTime.UtcNow
        };

        _context.StockTransactions.Add(transaction);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Stock transaction completed successfully.",
            productId = product.Id,
            productName = product.Name,
            transactionType = transaction.Type,
            transactionQuantity = transaction.Quantity,
            currentStock = product.Quantity
        });        
    }

    // GET: api/StockTransactions
    [HttpGet]
    public async Task<IActionResult> GetTransactions()
    {
        var transactions = await _context.StockTransactions
        .Include(t => t.Product)
        .OrderByDescending(t => t.TransactionDate)
        .Select(t => new
        {
            t.Id,
            t.ProductId,
            ProductName = t.Product.Name,
            t.Type,
            t.Quantity,
            t.TransactionDate,
            t.Note
        })
        .ToListAsync();

    return Ok(transactions);
}

//GET: api/StockTransactions/product/2
[HttpGet("product/{productId}")]
public async Task<IActionResult> GetProductTransactions(int productId)
    {
        var productExists = await _context.Products
        .AnyAsync(p => p.Id == productId);

        if (!productExists)
        {
            return NotFound("Product not found");
        }
        var transactions = await _context.StockTransactions
        .Where(t => t.ProductId == productId)
        .OrderByDescending(t => t.TransactionDate)
        .Select(t => new
        {
            t.Id,
            t.ProductId,
            ProductName = t.Product.Name,
            t.Type,
            t.Quantity,
            t.TransactionDate,
            t.Note
        })
        .ToListAsync();

    return Ok(transactions);

    }
    
}