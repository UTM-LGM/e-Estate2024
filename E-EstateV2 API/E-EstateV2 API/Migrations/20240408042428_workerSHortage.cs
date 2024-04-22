using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class workerSHortage : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_workerShortages_estates_estateId",
                table: "workerShortages");

            migrationBuilder.DropIndex(
                name: "IX_workerShortages_estateId",
                table: "workerShortages");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_workerShortages_estateId",
                table: "workerShortages",
                column: "estateId");

            migrationBuilder.AddForeignKey(
                name: "FK_workerShortages_estates_estateId",
                table: "workerShortages",
                column: "estateId",
                principalTable: "estates",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
