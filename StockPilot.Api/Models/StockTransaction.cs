using System.ComponentModel.DataAnnotations;

namespace StockPilot.Api.Models;

public class StockTransaction
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    [Required]
    [MaxLength(20)]
    public string Type { get; set; } = string.Empty;

    public int Quantity { get; set; }

    public DateTime TransactionDate { get; set; }
        = DateTime.UtcNow;

    [MaxLength(200)]
    public string? Note { get; set; }
}