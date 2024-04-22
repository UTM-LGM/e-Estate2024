using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class rubberSales : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_companies_companyId",
                table: "rubberSales");

            migrationBuilder.RenameColumn(
                name: "weight",
                table: "rubberSales",
                newName: "wetWeight");

            migrationBuilder.RenameColumn(
                name: "date",
                table: "rubberSales",
                newName: "weightSlipNo");

            migrationBuilder.RenameColumn(
                name: "companyId",
                table: "rubberSales",
                newName: "paymentStatusId");

            migrationBuilder.RenameColumn(
                name: "authorizationLetter",
                table: "rubberSales",
                newName: "licenseNo");

            migrationBuilder.RenameColumn(
                name: "amountPaid",
                table: "rubberSales",
                newName: "unitPrice");

            migrationBuilder.RenameIndex(
                name: "IX_rubberSales_companyId",
                table: "rubberSales",
                newName: "IX_rubberSales_paymentStatusId");

            migrationBuilder.AddColumn<float>(
                name: "buyerDRC",
                table: "rubberSales",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "buyerWetWeight",
                table: "rubberSales",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<string>(
                name: "letterOfConsentNo",
                table: "rubberSales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "saleDateTime",
                table: "rubberSales",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<float>(
                name: "total",
                table: "rubberSales",
                type: "real",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.CreateTable(
                name: "paymentStatuses",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_paymentStatuses", x => x.id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_paymentStatuses_paymentStatusId",
                table: "rubberSales",
                column: "paymentStatusId",
                principalTable: "paymentStatuses",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_paymentStatuses_paymentStatusId",
                table: "rubberSales");

            migrationBuilder.DropTable(
                name: "paymentStatuses");

            migrationBuilder.DropColumn(
                name: "buyerDRC",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "buyerWetWeight",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "letterOfConsentNo",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "saleDateTime",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "total",
                table: "rubberSales");

            migrationBuilder.RenameColumn(
                name: "wetWeight",
                table: "rubberSales",
                newName: "weight");

            migrationBuilder.RenameColumn(
                name: "weightSlipNo",
                table: "rubberSales",
                newName: "date");

            migrationBuilder.RenameColumn(
                name: "unitPrice",
                table: "rubberSales",
                newName: "amountPaid");

            migrationBuilder.RenameColumn(
                name: "paymentStatusId",
                table: "rubberSales",
                newName: "companyId");

            migrationBuilder.RenameColumn(
                name: "licenseNo",
                table: "rubberSales",
                newName: "authorizationLetter");

            migrationBuilder.RenameIndex(
                name: "IX_rubberSales_paymentStatusId",
                table: "rubberSales",
                newName: "IX_rubberSales_companyId");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_companies_companyId",
                table: "rubberSales",
                column: "companyId",
                principalTable: "companies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
