using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class diseaseCategory1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "diseaseCategoryId",
                table: "fieldDiseases",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_fieldDiseases_diseaseCategoryId",
                table: "fieldDiseases",
                column: "diseaseCategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldDiseases_diseaseCategories_diseaseCategoryId",
                table: "fieldDiseases",
                column: "diseaseCategoryId",
                principalTable: "diseaseCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldDiseases_diseaseCategories_diseaseCategoryId",
                table: "fieldDiseases");

            migrationBuilder.DropIndex(
                name: "IX_fieldDiseases_diseaseCategoryId",
                table: "fieldDiseases");

            migrationBuilder.DropColumn(
                name: "diseaseCategoryId",
                table: "fieldDiseases");
        }
    }
}
