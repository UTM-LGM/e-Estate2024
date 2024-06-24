using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class costAmountMonthYear : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "year",
                table: "costAmounts");

            migrationBuilder.AddColumn<string>(
                name: "monthYear",
                table: "costAmounts",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "monthYear",
                table: "costAmounts");

            migrationBuilder.AddColumn<int>(
                name: "year",
                table: "costAmounts",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
