using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class rubberSaleUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_buyers_estates_estateId",
                table: "buyers");

            migrationBuilder.DropForeignKey(
                name: "FK_rubberSales_estates_estateId",
                table: "rubberSales");

            migrationBuilder.DropIndex(
                name: "IX_rubberSales_estateId",
                table: "rubberSales");

            migrationBuilder.DropIndex(
                name: "IX_buyers_estateId",
                table: "buyers");

            migrationBuilder.DropColumn(
                name: "estateId",
                table: "rubberSales");

            migrationBuilder.AlterColumn<int>(
                name: "estateId",
                table: "buyers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "estateId",
                table: "rubberSales",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "estateId",
                table: "buyers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSales_estateId",
                table: "rubberSales",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_buyers_estateId",
                table: "buyers",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_buyers_estates_estateId",
                table: "buyers",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_rubberSales_estates_estateId",
                table: "rubberSales",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
