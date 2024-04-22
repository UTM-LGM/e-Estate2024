using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class workerShortageTapperField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "workerShortage",
                table: "workerShortages",
                newName: "tapperWorkerShortage");

            migrationBuilder.AddColumn<int>(
                name: "fieldWorkerShortage",
                table: "workerShortages",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fieldWorkerShortage",
                table: "workerShortages");

            migrationBuilder.RenameColumn(
                name: "tapperWorkerShortage",
                table: "workerShortages",
                newName: "workerShortage");
        }
    }
}
