using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class AddEstateDetailColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
            name: "MSNRStatus",
            table: "estateDetails",
            type: "bit",
            nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "polygonArea",
                table: "estateDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MSNRStatus",
                table: "estateDetails");

            migrationBuilder.DropColumn(
                name: "polygonArea",
                table: "estateDetails");
        }
    }
}
