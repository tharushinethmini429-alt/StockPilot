
using System.ComponentModel.DataAnnotations;

namespace StockPilot.Api.Models;

public class AppSettings
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string AdminName { get; set; } = "Administrator";

    [MaxLength(50)]
    public string Role { get; set; } = "System Administrator";

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = "admin@stockpilot.com";

    [Required]
    [MaxLength(100)]
    public string StoreName { get; set; } = "StockPilot";

    [MaxLength(100)]
    public string BusinessType { get; set; } = "General Inventory";
    
    [MaxLength(10)]
    public string Currency { get; set; } = "LKR";

    public int LowStockThreshold { get; set; } = 5;

    public bool EnableNotifications { get; set; } = true;

    public bool EnableOutOfStockAlerts { get; set; } = true;
    public int CriticalStockLevel { get; set; } = 2;
    
    [MaxLength(20)]
    public string DateFormat { get; set; } = "MM/dd/yyyy";
    public bool DashboardAutoRefresh { get; set; } = true;
    public bool EnableBackupReminder { get; set; } = true;
}
