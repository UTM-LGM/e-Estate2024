using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class licenseTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "licenseNo",
                table: "buyers",
                newName: "buyerLicenseNo");

            migrationBuilder.AddColumn<string>(
                name: "transactionLicenseNo",
                table: "rubberSales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "transactionLicenseNo",
                table: "rubberSaleHistories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "licenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_licenses", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "licenses");

            migrationBuilder.DropColumn(
                name: "transactionLicenseNo",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "transactionLicenseNo",
                table: "rubberSaleHistories");

            migrationBuilder.RenameColumn(
                name: "buyerLicenseNo",
                table: "buyers",
                newName: "licenseNo");
        }
    }
}
