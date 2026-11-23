using Microsoft.EntityFrameworkCore;
using StockPilot.Api.Controllers;
using StockPilot.Api.Models;

namespace StockPilot.Api.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<AppSettings> AppSettings { get; set; }
    public DbSet<StockTransaction> StockTransactions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<Product>()
        .HasIndex(p => p.SKU)
        .IsUnique();
    }
}
