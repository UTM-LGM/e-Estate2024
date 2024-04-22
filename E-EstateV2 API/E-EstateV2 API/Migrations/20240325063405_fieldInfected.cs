using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldInfected : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropIndex(
                name: "IX_fields_fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropColumn(
                name: "fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropColumn(
                name: "infectedPercentage",
                table: "fields");

            migrationBuilder.CreateTable(
                name: "fieldInfecteds",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    area = table.Column<int>(type: "int", nullable: false),
                    percentage = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldDiseaseId = table.Column<int>(type: "int", nullable: true),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldInfecteds", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldInfecteds_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fieldInfecteds_fieldDiseases_fieldDiseaseId",
                        column: x => x.fieldDiseaseId,
                        principalTable: "fieldDiseases",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfecteds_estateId",
                table: "fieldInfecteds",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfecteds_fieldDiseaseId",
                table: "fieldInfecteds",
                column: "fieldDiseaseId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fieldInfecteds");

            migrationBuilder.AddColumn<int>(
                name: "fieldDiseaseId",
                table: "fields",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "infectedPercentage",
                table: "fields",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_fields_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId");

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId",
                principalTable: "fieldDiseases",
                principalColumn: "Id");
        }
    }
}
