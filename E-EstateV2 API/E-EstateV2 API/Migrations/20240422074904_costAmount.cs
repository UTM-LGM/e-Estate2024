using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class costAmount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_costAmounts_estates_estateId",
                table: "costAmounts");

            migrationBuilder.DropIndex(
                name: "IX_costAmounts_estateId",
                table: "costAmounts");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_costAmounts_estateId",
                table: "costAmounts",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_costAmounts_estates_estateId",
                table: "costAmounts",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
