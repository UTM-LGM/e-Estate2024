using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class filePathColumnRename : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "fileUpload",
                table: "annoucements");

            migrationBuilder.RenameColumn(
                name: "FilePath",
                table: "annoucements",
                newName: "filePath");

            migrationBuilder.AddColumn<string>(
                name: "createdBy",
                table: "annoucements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "createdDate",
                table: "annoucements",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "isActive",
                table: "annoucements",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "updatedBy",
                table: "annoucements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updatedDate",
                table: "annoucements",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "createdBy",
                table: "annoucements");

            migrationBuilder.DropColumn(
                name: "createdDate",
                table: "annoucements");

            migrationBuilder.DropColumn(
                name: "isActive",
                table: "annoucements");

            migrationBuilder.DropColumn(
                name: "updatedBy",
                table: "annoucements");

            migrationBuilder.DropColumn(
                name: "updatedDate",
                table: "annoucements");

            migrationBuilder.RenameColumn(
                name: "filePath",
                table: "annoucements",
                newName: "FilePath");

            migrationBuilder.AddColumn<byte[]>(
                name: "fileUpload",
                table: "annoucements",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
