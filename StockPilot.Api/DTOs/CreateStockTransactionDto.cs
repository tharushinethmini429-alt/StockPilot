using System.ComponentModel.DataAnnotations;

namespace StockPilot.Api.DTOs;

public class CreateStockTransactionDto
{
    [Range(1, int.MaxValue)]
    public int ProductId { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [MaxLength(200)]
    public string? Note { get; set; }
}