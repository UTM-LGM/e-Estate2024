using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class historyTable1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "companyContactHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phoneNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    companyContactId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_companyContactHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_companyContactHistories_companyContacts_companyContactId",
                        column: x => x.companyContactId,
                        principalTable: "companyContacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "estateContactHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phoneNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    estateContactId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estateContactHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_estateContactHistories_estateContacts_estateContactId",
                        column: x => x.estateContactId,
                        principalTable: "estateContacts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fieldHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    area = table.Column<float>(type: "real", nullable: false),
                    rubberArea = table.Column<float>(type: "real", nullable: false),
                    isMature = table.Column<bool>(type: "bit", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    dateOpenTapping = table.Column<DateTime>(type: "datetime2", nullable: true),
                    yearPlanted = table.Column<int>(type: "int", nullable: false),
                    remark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    totalTask = table.Column<int>(type: "int", nullable: false),
                    initialTreeStand = table.Column<int>(type: "int", nullable: false),
                    currentTreeStand = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldStatusId = table.Column<int>(type: "int", nullable: true),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    fieldId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldHistories_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fieldHistories_fieldStatus_fieldStatusId",
                        column: x => x.fieldStatusId,
                        principalTable: "fieldStatus",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "fieldInfectedHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    areaInfected = table.Column<float>(type: "real", nullable: false),
                    areaInfectedPercentage = table.Column<int>(type: "int", nullable: false),
                    dateScreening = table.Column<DateTime>(type: "datetime2", nullable: false),
                    dateRecovered = table.Column<DateTime>(type: "datetime2", nullable: true),
                    severityLevel = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    remark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldDiseaseId = table.Column<int>(type: "int", nullable: true),
                    fieldId = table.Column<int>(type: "int", nullable: true),
                    fieldInfectedId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldInfectedHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldInfectedHistories_fieldDiseases_fieldDiseaseId",
                        column: x => x.fieldDiseaseId,
                        principalTable: "fieldDiseases",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_fieldInfectedHistories_fieldInfecteds_fieldInfectedId",
                        column: x => x.fieldInfectedId,
                        principalTable: "fieldInfecteds",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fieldInfectedHistories_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "rubberSaleHistories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    saleDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    rubberType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    letterOfConsentNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    receiptNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    receiptNoDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    wetWeight = table.Column<float>(type: "real", nullable: false),
                    buyerWetWeight = table.Column<float>(type: "real", nullable: false),
                    DRC = table.Column<float>(type: "real", nullable: false),
                    buyerDRC = table.Column<float>(type: "real", nullable: false),
                    unitPrice = table.Column<float>(type: "real", nullable: false),
                    total = table.Column<float>(type: "real", nullable: false),
                    weightSlipNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    weightSlipNoDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    transportPlateNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    driverName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    driverIc = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    remark = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    deliveryAgent = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    buyerId = table.Column<int>(type: "int", nullable: false),
                    paymentStatusId = table.Column<int>(type: "int", nullable: false),
                    MSNRStatus = table.Column<bool>(type: "bit", nullable: false),
                    rubberSaleId = table.Column<int>(type: "int", nullable: false),
                    rubberSalesId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rubberSaleHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rubberSaleHistories_buyers_buyerId",
                        column: x => x.buyerId,
                        principalTable: "buyers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rubberSaleHistories_paymentStatuses_paymentStatusId",
                        column: x => x.paymentStatusId,
                        principalTable: "paymentStatuses",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rubberSaleHistories_rubberSales_RubberSalesId",
                        column: x => x.rubberSalesId,
                        principalTable: "rubberSales",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_companyContactHistories_companyContactId",
                table: "companyContactHistories",
                column: "companyContactId");

            migrationBuilder.CreateIndex(
                name: "IX_estateContactHistories_estateContactId",
                table: "estateContactHistories",
                column: "estateContactId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldHistories_fieldId",
                table: "fieldHistories",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldHistories_fieldStatusId",
                table: "fieldHistories",
                column: "fieldStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfectedHistories_fieldDiseaseId",
                table: "fieldInfectedHistories",
                column: "fieldDiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfectedHistories_fieldId",
                table: "fieldInfectedHistories",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfectedHistories_fieldInfectedId",
                table: "fieldInfectedHistories",
                column: "fieldInfectedId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSaleHistories_buyerId",
                table: "rubberSaleHistories",
                column: "buyerId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSaleHistories_paymentStatusId",
                table: "rubberSaleHistories",
                column: "paymentStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSaleHistories_RubberSalesId",
                table: "rubberSaleHistories",
                column: "RubberSalesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "companyContactHistories");

            migrationBuilder.DropTable(
                name: "estateContactHistories");

            migrationBuilder.DropTable(
                name: "fieldHistories");

            migrationBuilder.DropTable(
                name: "fieldInfectedHistories");

            migrationBuilder.DropTable(
                name: "rubberSaleHistories");
        }
    }
}
