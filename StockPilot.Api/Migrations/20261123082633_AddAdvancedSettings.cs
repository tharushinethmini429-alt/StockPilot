using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StockPilot.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BusinessType",
                table: "AppSettings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CriticalStockLevel",
                table: "AppSettings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "AppSettings",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "DashboardAutoRefresh",
                table: "AppSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "DateFormat",
                table: "AppSettings",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "EnableBackupReminder",
                table: "AppSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "EnableOutOfStockAlerts",
                table: "AppSettings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "AppSettings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BusinessType",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "CriticalStockLevel",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "Currency",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "DashboardAutoRefresh",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "DateFormat",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "EnableBackupReminder",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "EnableOutOfStockAlerts",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "AppSettings");
        }
    }
}
