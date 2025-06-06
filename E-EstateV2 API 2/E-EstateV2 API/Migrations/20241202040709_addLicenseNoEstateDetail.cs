using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class addLicenseNoEstateDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "grantNo",
                table: "estateDetails",
                newName: "licenseNo");

            migrationBuilder.AddColumn<int>(
                name: "estateIdOld",
                table: "estateDetails",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "estateIdOld",
                table: "estateDetails");

            migrationBuilder.RenameColumn(
                name: "licenseNo",
                table: "estateDetails",
                newName: "grantNo");
        }
    }
}
