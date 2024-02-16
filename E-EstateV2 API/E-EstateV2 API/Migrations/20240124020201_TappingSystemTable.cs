using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class TappingSystemTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldInfoYearly_TappingSystem_tappingSystemId",
                table: "fieldInfoYearly");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TappingSystem",
                table: "TappingSystem");

            migrationBuilder.RenameTable(
                name: "TappingSystem",
                newName: "tappingSystems");

            migrationBuilder.AddPrimaryKey(
                name: "PK_tappingSystems",
                table: "tappingSystems",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldInfoYearly_tappingSystems_tappingSystemId",
                table: "fieldInfoYearly",
                column: "tappingSystemId",
                principalTable: "tappingSystems",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldInfoYearly_tappingSystems_tappingSystemId",
                table: "fieldInfoYearly");

            migrationBuilder.DropPrimaryKey(
                name: "PK_tappingSystems",
                table: "tappingSystems");

            migrationBuilder.RenameTable(
                name: "tappingSystems",
                newName: "TappingSystem");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TappingSystem",
                table: "TappingSystem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldInfoYearly_TappingSystem_tappingSystemId",
                table: "fieldInfoYearly",
                column: "tappingSystemId",
                principalTable: "TappingSystem",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
