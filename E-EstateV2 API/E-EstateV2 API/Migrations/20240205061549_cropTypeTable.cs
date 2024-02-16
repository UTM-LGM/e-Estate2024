using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class cropTypeTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields");

            migrationBuilder.AlterColumn<int>(
                name: "fieldDiseaseId",
                table: "fields",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "cropTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cropType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cropTypes", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId",
                principalTable: "fieldDiseases",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields");

            migrationBuilder.DropTable(
                name: "cropTypes");

            migrationBuilder.AlterColumn<int>(
                name: "fieldDiseaseId",
                table: "fields",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldDiseases_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId",
                principalTable: "fieldDiseases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
