using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class foreignLaborEstateId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_foreignLabors_estates_estateId",
                table: "foreignLabors");

            migrationBuilder.DropIndex(
                name: "IX_foreignLabors_estateId",
                table: "foreignLabors");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_foreignLabors_estateId",
                table: "foreignLabors",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_foreignLabors_estates_estateId",
                table: "foreignLabors",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
