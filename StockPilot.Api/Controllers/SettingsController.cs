using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Data;
using StockPilot.Api.Models;

namespace StockPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SettingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Settings
    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();

        if (settings == null)
        {
            settings = new AppSettings();
            _context.AppSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return Ok(settings);
    }

    // PUT: api/Settings
    [HttpPut]
    public async Task<IActionResult> UpdateSettings(AppSettings updatedSettings)
    {
        var settings = await _context.AppSettings.FirstOrDefaultAsync();

        if (settings == null)
        {
            settings = new AppSettings();
            _context.AppSettings.Add(settings);
        }

        settings.AdminName = updatedSettings.AdminName;
        settings.Email = updatedSettings.Email;
        settings.StoreName = updatedSettings.StoreName;
        settings.LowStockThreshold = updatedSettings.LowStockThreshold;
        settings.EnableNotifications = updatedSettings.EnableNotifications;
        
        settings.Role = updatedSettings.Role;
        settings.BusinessType = updatedSettings.BusinessType;
        settings.Currency = updatedSettings.Currency;
        settings.EnableOutOfStockAlerts = updatedSettings.EnableOutOfStockAlerts;
        settings.CriticalStockLevel = updatedSettings.CriticalStockLevel;
        settings.DateFormat = updatedSettings.DateFormat;
        settings.DashboardAutoRefresh = updatedSettings.DashboardAutoRefresh;
        settings.EnableBackupReminder = updatedSettings.EnableBackupReminder;
        
        await _context.SaveChangesAsync();

        return Ok(settings);
    }
}