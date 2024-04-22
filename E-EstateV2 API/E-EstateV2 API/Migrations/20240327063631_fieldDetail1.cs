using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class fieldDetail1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldStatus_fieldStatusId",
                table: "fields");

            migrationBuilder.AlterColumn<int>(
                name: "fieldStatusId",
                table: "fields",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldStatus_fieldStatusId",
                table: "fields",
                column: "fieldStatusId",
                principalTable: "fieldStatus",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_fields_fieldStatus_fieldStatusId",
                table: "fields");

            migrationBuilder.AlterColumn<int>(
                name: "fieldStatusId",
                table: "fields",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_fields_fieldStatus_fieldStatusId",
                table: "fields",
                column: "fieldStatusId",
                principalTable: "fieldStatus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
