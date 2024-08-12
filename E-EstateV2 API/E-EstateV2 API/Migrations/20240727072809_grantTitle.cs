using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class grantTitle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "grantTitles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    grantTitle = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_grantTitles", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_fieldGrants_fieldId",
                table: "fieldGrants",
                column: "fieldId");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldGrants_fields_fieldId",
                table: "fieldGrants",
                column: "fieldId",
                principalTable: "fields",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldGrants_fields_fieldId",
                table: "fieldGrants");

            migrationBuilder.DropTable(
                name: "grantTitles");

            migrationBuilder.DropIndex(
                name: "IX_fieldGrants_fieldId",
                table: "fieldGrants");
        }
    }
}
