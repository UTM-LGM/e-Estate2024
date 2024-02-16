using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class OwnershipId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ownershipId",
                table: "companies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_companies_ownershipId",
                table: "companies",
                column: "ownershipId");

            migrationBuilder.AddForeignKey(
                name: "FK_companies_ownerships_ownershipId",
                table: "companies",
                column: "ownershipId",
                principalTable: "ownerships",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_companies_ownerships_ownershipId",
                table: "companies");

            migrationBuilder.DropIndex(
                name: "IX_companies_ownershipId",
                table: "companies");

            migrationBuilder.DropColumn(
                name: "ownershipId",
                table: "companies");
        }
    }
}
