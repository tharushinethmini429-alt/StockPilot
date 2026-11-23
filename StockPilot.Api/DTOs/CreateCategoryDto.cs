using System.ComponentModel.DataAnnotations;

namespace StockPilot.Api.DTOs;

public class CreateCategoryDto
{
    [Required]
    [MaxLength(80)]
    public string Name { get; set; } = string.Empty;
}