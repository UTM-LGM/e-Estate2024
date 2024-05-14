using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class deliveryAgentColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "deliveryAgent",
                table: "rubberSales",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "receiptNoDate",
                table: "rubberSales",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "weightSlipNoDate",
                table: "rubberSales",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "deliveryAgent",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "receiptNoDate",
                table: "rubberSales");

            migrationBuilder.DropColumn(
                name: "weightSlipNoDate",
                table: "rubberSales");
        }
    }
}
