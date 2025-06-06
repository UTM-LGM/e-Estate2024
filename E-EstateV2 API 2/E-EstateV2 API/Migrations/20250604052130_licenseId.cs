using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class licenseId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "workerShortages",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "rubberStocks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "rubberSales",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "rubberSaleHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "laborInfos",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "fields",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "fieldHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "estateDetails",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "estateContacts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "estateContactHistories",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "costAmounts",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "buyers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "licenseId",
                table: "AspNetUsers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_workerShortages_licenseId",
                table: "workerShortages",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberStocks_licenseId",
                table: "rubberStocks",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSales_licenseId",
                table: "rubberSales",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSaleHistories_licenseId",
                table: "rubberSaleHistories",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_laborInfos_licenseId",
                table: "laborInfos",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_fields_licenseId",
                table: "fields",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldHistories_licenseId",
                table: "fieldHistories",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_estateDetails_licenseId",
                table: "estateDetails",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_estateContacts_licenseId",
                table: "estateContacts",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_estateContactHistories_licenseId",
                table: "estateContactHistories",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_costAmounts_licenseId",
                table: "costAmounts",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_buyers_licenseId",
                table: "buyers",
                column: "licenseId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_licenseId",
                table: "AspNetUsers",
                column: "licenseId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_licenses_licenseId",
                table: "AspNetUsers",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_buyers_licenses_licenseId",
                table: "buyers",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_costAmounts_licenses_licenseId",
                table: "costAmounts",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_estateContactHistories_licenses_licenseId",
                table: "estateContactHistories",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_estateContacts_licenses_licenseId",
                table: "estateContacts",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_estateDetails_licenses_licenseId",
                table: "estateDetails",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldHistories_licenses_licenseId",
                table: "fieldHistories",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_fields_licenses_licenseId",
                table: "fields",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_laborInfos_licenses_licenseId",
                table: "laborInfos",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSaleHistories_licenses_licenseId",
                table: "rubberSaleHistories",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_licenses_licenseId",
                table: "rubberSales",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberStocks_licenses_licenseId",
                table: "rubberStocks",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_workerShortages_licenses_licenseId",
                table: "workerShortages",
                column: "licenseId",
                principalTable: "licenses",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_licenses_licenseId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_buyers_licenses_licenseId",
                table: "buyers");

            migrationBuilder.DropForeignKey(
                name: "FK_costAmounts_licenses_licenseId",
                table: "costAmounts");

            migrationBuilder.DropForeignKey(
                name: "FK_estateContactHistories_licenses_licenseId",
                table: "estateContactHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_estateContacts_licenses_licenseId",
                table: "estateContacts");

            migrationBuilder.DropForeignKey(
                name: "FK_estateDetails_licenses_licenseId",
                table: "estateDetails");

            migrationBuilder.DropForeignKey(
                name: "FK_fieldHistories_licenses_licenseId",
                table: "fieldHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_fields_licenses_licenseId",
                table: "fields");

            migrationBuilder.DropForeignKey(
                name: "FK_laborInfos_licenses_licenseId",
                table: "laborInfos");

            migrationBuilder.DropForeignKey(
                name: "FK_rubberSaleHistories_licenses_licenseId",
                table: "rubberSaleHistories");

            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_licenses_licenseId",
                table: "rubberSales");

            migrationBuilder.DropForeignKey(
                name: "FK_rubberStocks_licenses_licenseId",
                table: "rubberStocks");

            migrationBuilder.DropForeignKey(
                name: "FK_workerShortages_licenses_licenseId",
                table: "workerShortages");

            migrationBuilder.DropIndex(
                name: "IX_workerShortages_licenseId",
                table: "workerShortages");

            migrationBuilder.DropIndex(
                name: "IX_rubberStocks_licenseId",
                table: "rubberStocks");

            migrationBuilder.DropIndex(
                name: "IX_rubberSales_licenseId",
                table: "rubberSales");

            migrationBuilder.DropIndex(
                name: "IX_rubberSaleHistories_licenseId",
                table: "rubberSaleHistories");

            migrationBuilder.DropIndex(
                name: "IX_laborInfos_licenseId",
                table: "laborInfos");

            migrationBuilder.DropIndex(
                name: "IX_fields_licenseId",
                table: "fields");

            migrationBuilder.DropIndex(
                name: "IX_fieldHistories_licenseId",
                table: "fieldHistories");

            migrationBuilder.DropIndex(
                name: "IX_estateDetails_licenseId",
                table: "estateDetails");

            migrationBuilder.DropIndex(
                name: "IX_estateContacts_licenseId",
                table: "estateContacts");

            migrationBuilder.DropIndex(
                name: "IX_estateContactHistories_licenseId",
                table: "estateContactHistories");

            migrationBuilder.DropIndex(
                name: "IX_costAmounts_licenseId",
                table: "costAmounts");

            migrationBuilder.DropIndex(
                name: "IX_buyers_licenseId",
                table: "buyers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_licenseId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "workerShortages");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "rubberStocks");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "rubberSaleHistories");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "laborInfos");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "fields");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "fieldHistories");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "estateDetails");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "estateContacts");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "estateContactHistories");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "costAmounts");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "buyers");

            migrationBuilder.DropColumn(
                name: "licenseId",
                table: "AspNetUsers");
        }
    }
}
