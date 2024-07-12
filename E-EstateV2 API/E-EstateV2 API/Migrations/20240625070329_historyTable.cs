using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class historyTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSaleHistories_rubberSales_RubberSalesId",
                table: "rubberSaleHistories");

            migrationBuilder.DropColumn(
                name: "rubberSaleId",
                table: "rubberSaleHistories");

            migrationBuilder.RenameColumn(
                name: "RubberSalesId",
                table: "rubberSaleHistories",
                newName: "rubberSalesId");

            migrationBuilder.RenameIndex(
                name: "IX_rubberSaleHistories_RubberSalesId",
                table: "rubberSaleHistories",
                newName: "IX_rubberSaleHistories_rubberSalesId");

            migrationBuilder.AlterColumn<int>(
                name: "rubberSalesId",
                table: "rubberSaleHistories",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSaleHistories_rubberSales_rubberSalesId",
                table: "rubberSaleHistories",
                column: "rubberSalesId",
                principalTable: "rubberSales",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSaleHistories_rubberSales_rubberSalesId",
                table: "rubberSaleHistories");

            migrationBuilder.RenameColumn(
                name: "rubberSalesId",
                table: "rubberSaleHistories",
                newName: "RubberSalesId");

            migrationBuilder.RenameIndex(
                name: "IX_rubberSaleHistories_rubberSalesId",
                table: "rubberSaleHistories",
                newName: "IX_rubberSaleHistories_RubberSalesId");

            migrationBuilder.AlterColumn<int>(
                name: "RubberSalesId",
                table: "rubberSaleHistories",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "rubberSaleId",
                table: "rubberSaleHistories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSaleHistories_rubberSales_RubberSalesId",
                table: "rubberSaleHistories",
                column: "RubberSalesId",
                principalTable: "rubberSales",
                principalColumn: "Id");
        }
    }
}
