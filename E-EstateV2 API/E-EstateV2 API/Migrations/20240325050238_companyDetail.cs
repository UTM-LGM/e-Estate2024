using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class companyDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_estates_establishments_establishmentId",
                table: "estates");

            migrationBuilder.DropForeignKey(
                name: "FK_estates_financialYears_financialYearId",
                table: "estates");

            migrationBuilder.DropForeignKey(
                name: "FK_estates_membershipTypes_membershipTypeId",
                table: "estates");

            migrationBuilder.DropIndex(
                name: "IX_estates_establishmentId",
                table: "estates");

            migrationBuilder.DropIndex(
                name: "IX_estates_financialYearId",
                table: "estates");

            migrationBuilder.DropIndex(
                name: "IX_estates_membershipTypeId",
                table: "estates");

            migrationBuilder.DropColumn(
                name: "establishmentId",
                table: "estates");

            migrationBuilder.DropColumn(
                name: "financialYearId",
                table: "estates");

            migrationBuilder.DropColumn(
                name: "membershipTypeId",
                table: "estates");

            migrationBuilder.AddColumn<int>(
                name: "establishmentId",
                table: "companies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "financialYearId",
                table: "companies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "membershipTypeId",
                table: "companies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_companies_establishmentId",
                table: "companies",
                column: "establishmentId");

            migrationBuilder.CreateIndex(
                name: "IX_companies_financialYearId",
                table: "companies",
                column: "financialYearId");

            migrationBuilder.CreateIndex(
                name: "IX_companies_membershipTypeId",
                table: "companies",
                column: "membershipTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_companies_establishments_establishmentId",
                table: "companies",
                column: "establishmentId",
                principalTable: "establishments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_companies_financialYears_financialYearId",
                table: "companies",
                column: "financialYearId",
                principalTable: "financialYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_companies_membershipTypes_membershipTypeId",
                table: "companies",
                column: "membershipTypeId",
                principalTable: "membershipTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_companies_establishments_establishmentId",
                table: "companies");

            migrationBuilder.DropForeignKey(
                name: "FK_companies_financialYears_financialYearId",
                table: "companies");

            migrationBuilder.DropForeignKey(
                name: "FK_companies_membershipTypes_membershipTypeId",
                table: "companies");

            migrationBuilder.DropIndex(
                name: "IX_companies_establishmentId",
                table: "companies");

            migrationBuilder.DropIndex(
                name: "IX_companies_financialYearId",
                table: "companies");

            migrationBuilder.DropIndex(
                name: "IX_companies_membershipTypeId",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "establishmentId",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "financialYearId",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "membershipTypeId",
                table: "companies");

            migrationBuilder.AddColumn<int>(
                name: "establishmentId",
                table: "estates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "financialYearId",
                table: "estates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "membershipTypeId",
                table: "estates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_estates_establishmentId",
                table: "estates",
                column: "establishmentId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_financialYearId",
                table: "estates",
                column: "financialYearId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_membershipTypeId",
                table: "estates",
                column: "membershipTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_estates_establishments_establishmentId",
                table: "estates",
                column: "establishmentId",
                principalTable: "establishments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_estates_financialYears_financialYearId",
                table: "estates",
                column: "financialYearId",
                principalTable: "financialYears",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_estates_membershipTypes_membershipTypeId",
                table: "estates",
                column: "membershipTypeId",
                principalTable: "membershipTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
