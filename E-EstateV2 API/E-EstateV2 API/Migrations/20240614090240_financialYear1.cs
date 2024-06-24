using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class financialYear1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "endFinancialYaer",
                table: "companyDetails",
                newName: "endFinancialYear");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "endFinancialYear",
                table: "companyDetails",
                newName: "endFinancialYaer");
        }
    }
}
