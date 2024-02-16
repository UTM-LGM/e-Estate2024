using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class TappingSystem : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "tappingSystem",
                table: "fieldInfoYearly");

            migrationBuilder.AddColumn<int>(
                name: "tappingSystemId",
                table: "fieldInfoYearly",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "TappingSystem",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tappingSystem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TappingSystem", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfoYearly_tappingSystemId",
                table: "fieldInfoYearly",
                column: "tappingSystemId");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldInfoYearly_TappingSystem_tappingSystemId",
                table: "fieldInfoYearly",
                column: "tappingSystemId",
                principalTable: "TappingSystem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldInfoYearly_TappingSystem_tappingSystemId",
                table: "fieldInfoYearly");

            migrationBuilder.DropTable(
                name: "TappingSystem");

            migrationBuilder.DropIndex(
                name: "IX_fieldInfoYearly_tappingSystemId",
                table: "fieldInfoYearly");

            migrationBuilder.DropColumn(
                name: "tappingSystemId",
                table: "fieldInfoYearly");

            migrationBuilder.AddColumn<string>(
                name: "tappingSystem",
                table: "fieldInfoYearly",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
