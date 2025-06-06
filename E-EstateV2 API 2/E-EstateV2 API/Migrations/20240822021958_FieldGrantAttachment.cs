using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class FieldGrantAttachment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fileName",
                table: "fieldGrants");

            migrationBuilder.DropColumn(
                name: "filePath",
                table: "fieldGrants");

            migrationBuilder.CreateTable(
                name: "fieldGrantAttachments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    filePath = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldGrantId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldGrantAttachments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldGrantAttachments_fieldGrants_fieldGrantId",
                        column: x => x.fieldGrantId,
                        principalTable: "fieldGrants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fieldGrantAttachments_fieldGrantId",
                table: "fieldGrantAttachments",
                column: "fieldGrantId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "fieldGrantAttachments");

            migrationBuilder.AddColumn<string>(
                name: "fileName",
                table: "fieldGrants",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "filePath",
                table: "fieldGrants",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
