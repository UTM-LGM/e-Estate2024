using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class createdYearColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "yearCreated",
                table: "productionComparisons");

            migrationBuilder.AddColumn<int>(
                name: "createdYear",
                table: "productionComparisons",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "createdYear",
                table: "productionComparisons");

            migrationBuilder.AddColumn<string>(
                name: "yearCreated",
                table: "productionComparisons",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
