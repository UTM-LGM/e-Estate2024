using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldConversion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "otherCrop",
                table: "fields");

            migrationBuilder.CreateTable(
                name: "fieldConversions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldId = table.Column<int>(type: "int", nullable: false),
                    newCropName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sinceYear = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldConversions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldConversions_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fieldConversions_fieldId",
                table: "fieldConversions",
                column: "fieldId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fieldConversions");

            migrationBuilder.AddColumn<string>(
                name: "otherCrop",
                table: "fields",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
