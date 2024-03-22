using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class estateDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "grantNo",
                table: "estates",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "plantingMaterialId",
                table: "estates",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_estates_plantingMaterialId",
                table: "estates",
                column: "plantingMaterialId");

            migrationBuilder.AddForeignKey(
                name: "FK_estates_plantingMaterials_plantingMaterialId",
                table: "estates",
                column: "plantingMaterialId",
                principalTable: "plantingMaterials",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_estates_plantingMaterials_plantingMaterialId",
                table: "estates");

            migrationBuilder.DropIndex(
                name: "IX_estates_plantingMaterialId",
                table: "estates");

            migrationBuilder.DropColumn(
                name: "grantNo",
                table: "estates");

            migrationBuilder.DropColumn(
                name: "plantingMaterialId",
                table: "estates");
        }
    }
}
