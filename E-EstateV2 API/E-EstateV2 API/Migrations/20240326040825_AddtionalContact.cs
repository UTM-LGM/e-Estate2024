using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class AddtionalContact : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_companyContacts_companies_CompanyId",
                table: "companyContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_estateContacts_estates_EstateId",
                table: "estateContacts");

            migrationBuilder.DropIndex(
                name: "IX_estateContacts_EstateId",
                table: "estateContacts");

            migrationBuilder.DropIndex(
                name: "IX_companyContacts_CompanyId",
                table: "companyContacts");

            migrationBuilder.RenameColumn(
                name: "EstateId",
                table: "estateContacts",
                newName: "estateId");

            migrationBuilder.RenameColumn(
                name: "CompanyId",
                table: "companyContacts",
                newName: "companyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "estateId",
                table: "estateContacts",
                newName: "EstateId");

            migrationBuilder.RenameColumn(
                name: "companyId",
                table: "companyContacts",
                newName: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_estateContacts_EstateId",
                table: "estateContacts",
                column: "EstateId");

            migrationBuilder.CreateIndex(
                name: "IX_companyContacts_CompanyId",
                table: "companyContacts",
                column: "CompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_companyContacts_companies_CompanyId",
                table: "companyContacts",
                column: "CompanyId",
                principalTable: "companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_estateContacts_estates_EstateId",
                table: "estateContacts",
                column: "EstateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
