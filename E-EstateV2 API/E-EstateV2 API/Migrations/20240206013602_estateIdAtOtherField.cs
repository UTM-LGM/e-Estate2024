using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class estateIdAtOtherField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "estateId",
                table: "otherFields",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_otherFields_estateId",
                table: "otherFields",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_otherFields_estates_estateId",
                table: "otherFields",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_otherFields_estates_estateId",
                table: "otherFields");

            migrationBuilder.DropIndex(
                name: "IX_otherFields_estateId",
                table: "otherFields");

            migrationBuilder.DropColumn(
                name: "estateId",
                table: "otherFields");
        }
    }
}
