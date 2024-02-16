using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class RemoveWorkerNeeded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "workerNeeded",
                table: "foreignLabors");

            migrationBuilder.AlterColumn<string>(
                name: "state",
                table: "states",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_states_state",
                table: "states",
                column: "state",
                unique: true,
                filter: "[state] IS NOT NULL");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_states_state",
                table: "states");

            migrationBuilder.AlterColumn<string>(
                name: "state",
                table: "states",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "workerNeeded",
                table: "foreignLabors",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
