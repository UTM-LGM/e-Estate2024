using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_estates_estateId",
                table: "fields");

            migrationBuilder.DropIndex(
                name: "IX_fields_estateId",
                table: "fields");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_fields_estateId",
                table: "fields",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_fields_estates_estateId",
                table: "fields",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
