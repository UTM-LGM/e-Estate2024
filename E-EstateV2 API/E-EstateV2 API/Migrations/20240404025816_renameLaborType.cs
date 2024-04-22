using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class renameLaborType : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_laborByCategories_localLaborTypes_laborTypeId",
                table: "laborByCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_localLabors_localLaborTypes_laborTypeId",
                table: "localLabors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_localLaborTypes",
                table: "localLaborTypes");

            migrationBuilder.RenameTable(
                name: "localLaborTypes",
                newName: "laborTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_laborTypes",
                table: "laborTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_laborByCategories_laborTypes_laborTypeId",
                table: "laborByCategories",
                column: "laborTypeId",
                principalTable: "laborTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_localLabors_laborTypes_laborTypeId",
                table: "localLabors",
                column: "laborTypeId",
                principalTable: "laborTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_laborByCategories_laborTypes_laborTypeId",
                table: "laborByCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_localLabors_laborTypes_laborTypeId",
                table: "localLabors");

            migrationBuilder.DropPrimaryKey(
                name: "PK_laborTypes",
                table: "laborTypes");

            migrationBuilder.RenameTable(
                name: "laborTypes",
                newName: "localLaborTypes");

            migrationBuilder.AddPrimaryKey(
                name: "PK_localLaborTypes",
                table: "localLaborTypes",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_laborByCategories_localLaborTypes_laborTypeId",
                table: "laborByCategories",
                column: "laborTypeId",
                principalTable: "localLaborTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_localLabors_localLaborTypes_laborTypeId",
                table: "localLabors",
                column: "laborTypeId",
                principalTable: "localLaborTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
