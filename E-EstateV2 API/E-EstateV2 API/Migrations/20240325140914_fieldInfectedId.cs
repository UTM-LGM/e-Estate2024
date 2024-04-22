using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldInfectedId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fieldInfecteds_estates_estateId",
                table: "fieldInfecteds");

            migrationBuilder.DropIndex(
                name: "IX_fieldInfecteds_estateId",
                table: "fieldInfecteds");

            migrationBuilder.DropColumn(
                name: "estateId",
                table: "fieldInfecteds");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "estateId",
                table: "fieldInfecteds",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfecteds_estateId",
                table: "fieldInfecteds",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_fieldInfecteds_estates_estateId",
                table: "fieldInfecteds",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
