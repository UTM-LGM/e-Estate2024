using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class severityLevel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "dateInfected",
                table: "fieldInfecteds",
                newName: "dateScreening");

            migrationBuilder.AddColumn<string>(
                name: "severityLevel",
                table: "fieldInfecteds",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "severityLevel",
                table: "fieldInfecteds");

            migrationBuilder.RenameColumn(
                name: "dateScreening",
                table: "fieldInfecteds",
                newName: "dateInfected");
        }
    }
}
