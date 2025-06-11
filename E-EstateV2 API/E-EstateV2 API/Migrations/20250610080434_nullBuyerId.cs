using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class nullBuyerId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_buyers_buyerId",
                table: "rubberSales");

            migrationBuilder.AlterColumn<int>(
                name: "buyerId",
                table: "rubberSales",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_buyers_buyerId",
                table: "rubberSales",
                column: "buyerId",
                principalTable: "buyers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_buyers_buyerId",
                table: "rubberSales");

            migrationBuilder.AlterColumn<int>(
                name: "buyerId",
                table: "rubberSales",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_buyers_buyerId",
                table: "rubberSales",
                column: "buyerId",
                principalTable: "buyers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
