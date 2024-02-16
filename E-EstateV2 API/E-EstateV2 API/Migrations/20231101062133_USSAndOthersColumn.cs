using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class USSAndOthersColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "USS",
                table: "fieldProductions",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "USSDRC",
                table: "fieldProductions",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "others",
                table: "fieldProductions",
                type: "real",
                nullable: false,
                defaultValue: 0f);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "USS",
                table: "fieldProductions");

            migrationBuilder.DropColumn(
                name: "USSDRC",
                table: "fieldProductions");

            migrationBuilder.DropColumn(
                name: "others",
                table: "fieldProductions");
        }
    }
}
