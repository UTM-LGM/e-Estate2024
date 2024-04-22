using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class rubberSaleEstateId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "licenseNo",
                table: "rubberSales");

            migrationBuilder.AddColumn<int>(
                name: "estateId",
                table: "rubberSales",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "estateId",
                table: "rubberSales");

            migrationBuilder.AddColumn<string>(
                name: "licenseNo",
                table: "rubberSales",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
