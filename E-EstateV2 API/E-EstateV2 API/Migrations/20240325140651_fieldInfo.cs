using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "area",
                table: "fieldInfecteds");

            migrationBuilder.DropColumn(
                name: "fieldName",
                table: "fieldInfecteds");

            migrationBuilder.AddColumn<int>(
                name: "fieldId",
                table: "fieldInfecteds",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfecteds_fieldId",
                table: "fieldInfecteds",
                column: "fieldId");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldInfecteds_fields_fieldId",
                table: "fieldInfecteds",
                column: "fieldId",
                principalTable: "fields",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldInfecteds_fields_fieldId",
                table: "fieldInfecteds");

            migrationBuilder.DropIndex(
                name: "IX_fieldInfecteds_fieldId",
                table: "fieldInfecteds");

            migrationBuilder.DropColumn(
                name: "fieldId",
                table: "fieldInfecteds");

            migrationBuilder.AddColumn<int>(
                name: "area",
                table: "fieldInfecteds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "fieldName",
                table: "fieldInfecteds",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
