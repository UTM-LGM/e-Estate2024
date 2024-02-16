using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldDisease : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "fieldDiseaseId",
                table: "fields",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "fieldDiseases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    diseaseName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldDiseases", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fields_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId",
                principalTable: "fieldDiseases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropTable(
                name: "fieldDiseases");

            migrationBuilder.DropIndex(
                name: "IX_fields_fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropColumn(
                name: "fieldDiseaseId",
                table: "fields");
        }
    }
}
