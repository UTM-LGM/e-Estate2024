using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "announcements",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tittle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    filePath = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_announcements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Discriminator = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    fullName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    position = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isEmailVerified = table.Column<bool>(type: "bit", nullable: true),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "clones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cloneName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_clones", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "costCategories",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    costCategory = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costCategories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "costSubcategories1",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    costSubcategory1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costSubcategories1", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "costSubcategories2",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    costSubcategory2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costSubcategories2", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "costTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    costType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "countries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    country = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isLocal = table.Column<bool>(type: "bit", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_countries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "cropTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    cropType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_cropTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "establishments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    establishment = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_establishments", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "fieldDiseases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    diseaseName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldDiseases", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "fieldStatus",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isMature = table.Column<bool>(type: "bit", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldStatus", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "financialYears",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    financialYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_financialYears", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "historyLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    entityType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    entityId = table.Column<int>(type: "int", nullable: false),
                    method = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_historyLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "localLaborTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    laborType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_localLaborTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "membershipTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    membershipType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_membershipTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ownerships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ownership = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ownerships", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "plantingMaterials",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    plantingMaterial = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_plantingMaterials", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "states",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    state = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_states", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "tappingSystems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    tappingSystem = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tappingSystems", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "userActivityLogs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    userId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    userName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    role = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    dateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    method = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    body = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    url = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_userActivityLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "costs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    isMature = table.Column<bool>(type: "bit", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    costTypeId = table.Column<int>(type: "int", nullable: false),
                    costCategoryId = table.Column<int>(type: "int", nullable: false),
                    costSubcategory1Id = table.Column<int>(type: "int", nullable: false),
                    costSubcategory2Id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_costs_costCategories_costCategoryId",
                        column: x => x.costCategoryId,
                        principalTable: "costCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_costs_costSubcategories1_costSubcategory1Id",
                        column: x => x.costSubcategory1Id,
                        principalTable: "costSubcategories1",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_costs_costSubcategories2_costSubcategory2Id",
                        column: x => x.costSubcategory2Id,
                        principalTable: "costSubcategories2",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_costs_costTypes_costTypeId",
                        column: x => x.costTypeId,
                        principalTable: "costTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "towns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    town = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    stateId = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_towns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_towns_states_stateId",
                        column: x => x.stateId,
                        principalTable: "states",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "companies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    companyName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    postcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    contactNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    managerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    townId = table.Column<int>(type: "int", nullable: false),
                    ownershipId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_companies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_companies_ownerships_ownershipId",
                        column: x => x.ownershipId,
                        principalTable: "ownerships",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_companies_towns_townId",
                        column: x => x.townId,
                        principalTable: "towns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "companyContacts",
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
                    CompanyId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_companyContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_companyContacts_companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "estates",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    estateName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address1 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address2 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    address3 = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    postcode = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    fax = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    email = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    totalArea = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    managerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    latitudeLongitude = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    townId = table.Column<int>(type: "int", nullable: false),
                    establishmentId = table.Column<int>(type: "int", nullable: false),
                    financialYearId = table.Column<int>(type: "int", nullable: false),
                    membershipTypeId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estates", x => x.Id);
                    table.ForeignKey(
                        name: "FK_estates_companies_companyId",
                        column: x => x.companyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_estates_establishments_establishmentId",
                        column: x => x.establishmentId,
                        principalTable: "establishments",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_estates_financialYears_financialYearId",
                        column: x => x.financialYearId,
                        principalTable: "financialYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_estates_membershipTypes_membershipTypeId",
                        column: x => x.membershipTypeId,
                        principalTable: "membershipTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_estates_towns_townId",
                        column: x => x.townId,
                        principalTable: "towns",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "buyers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    buyerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_buyers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_buyers_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "costAmounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    year = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    costId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_costAmounts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_costAmounts_costs_costId",
                        column: x => x.costId,
                        principalTable: "costs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_costAmounts_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "estateContacts",
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
                    EstateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_estateContacts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_estateContacts_estates_EstateId",
                        column: x => x.EstateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fields",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    area = table.Column<int>(type: "int", nullable: false),
                    isMature = table.Column<bool>(type: "bit", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    dateOpenTapping = table.Column<DateTime>(type: "datetime2", nullable: true),
                    infectedPercentage = table.Column<int>(type: "int", nullable: false),
                    yearPlanted = table.Column<int>(type: "int", nullable: false),
                    totalTask = table.Column<int>(type: "int", nullable: false),
                    initialTreeStand = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldStatusId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false),
                    fieldDiseaseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fields_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fields_fieldDiseases_fieldDiseaseId",
                        column: x => x.fieldDiseaseId,
                        principalTable: "fieldDiseases",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_fields_fieldStatus_fieldStatusId",
                        column: x => x.fieldStatusId,
                        principalTable: "fieldStatus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "foreignLabors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    monthYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    tapperCheckrole = table.Column<int>(type: "int", nullable: false),
                    tapperContractor = table.Column<int>(type: "int", nullable: false),
                    fieldCheckrole = table.Column<int>(type: "int", nullable: false),
                    fieldContractor = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    countryId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_foreignLabors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_foreignLabors_countries_countryId",
                        column: x => x.countryId,
                        principalTable: "countries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_foreignLabors_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "localLabors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    monthYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    totalWorker = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    laborTypeId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_localLabors", x => x.Id);
                    table.ForeignKey(
                        name: "FK_localLabors_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_localLabors_localLaborTypes_laborTypeId",
                        column: x => x.laborTypeId,
                        principalTable: "localLaborTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "otherFields",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    area = table.Column<int>(type: "int", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    cropTypeId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_otherFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_otherFields_cropTypes_cropTypeId",
                        column: x => x.cropTypeId,
                        principalTable: "cropTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_otherFields_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "productionComparisons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    createdYear = table.Column<int>(type: "int", nullable: false),
                    currentYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    previousYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    productionComparison = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    reason = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_productionComparisons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_productionComparisons_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sellers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    sellerName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    licenseNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sellers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sellers_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "workerShortages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    monthYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    workerShortage = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_workerShortages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_workerShortages_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "buyerCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    buyerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_buyerCompanies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_buyerCompanies_buyers_buyerId",
                        column: x => x.buyerId,
                        principalTable: "buyers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_buyerCompanies_companies_companyId",
                        column: x => x.companyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rubberSales",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    rubberType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    authorizationLetter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    receiptNo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    weight = table.Column<float>(type: "real", nullable: false),
                    DRC = table.Column<float>(type: "real", nullable: false),
                    amountPaid = table.Column<float>(type: "real", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    buyerId = table.Column<int>(type: "int", nullable: false),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rubberSales", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rubberSales_buyers_buyerId",
                        column: x => x.buyerId,
                        principalTable: "buyers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rubberSales_companies_companyId",
                        column: x => x.companyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rubberSales_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "fieldClones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    fieldId = table.Column<int>(type: "int", nullable: false),
                    cloneId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldClones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldClones_clones_cloneId",
                        column: x => x.cloneId,
                        principalTable: "clones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fieldClones_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fieldConversions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    fieldId = table.Column<int>(type: "int", nullable: false),
                    conversionCropName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    sinceYear = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldConversions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldConversions_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fieldInfoYearly",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    year = table.Column<int>(type: "int", nullable: false),
                    currentTreeStand = table.Column<int>(type: "int", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldId = table.Column<int>(type: "int", nullable: false),
                    tappingSystemId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldInfoYearly", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldInfoYearly_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_fieldInfoYearly_tappingSystems_tappingSystemId",
                        column: x => x.tappingSystemId,
                        principalTable: "tappingSystems",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fieldProductions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    monthYear = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    cuplump = table.Column<float>(type: "real", nullable: false),
                    cuplumpDRC = table.Column<float>(type: "real", nullable: false),
                    latex = table.Column<float>(type: "real", nullable: false),
                    latexDRC = table.Column<float>(type: "real", nullable: false),
                    USS = table.Column<float>(type: "real", nullable: false),
                    USSDRC = table.Column<float>(type: "real", nullable: false),
                    others = table.Column<float>(type: "real", nullable: false),
                    othersDRC = table.Column<float>(type: "real", nullable: false),
                    noTaskTap = table.Column<int>(type: "int", nullable: false),
                    noTaskUntap = table.Column<int>(type: "int", nullable: false),
                    remarkUntap = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    fieldId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_fieldProductions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_fieldProductions_fields_fieldId",
                        column: x => x.fieldId,
                        principalTable: "fields",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "rubberPurchases",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    date = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    project = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    rubberType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    authorizationLetter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    weight = table.Column<float>(type: "real", nullable: false),
                    DRC = table.Column<float>(type: "real", nullable: false),
                    price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    totalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    createdBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    createdDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    updatedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    updatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    sellerId = table.Column<int>(type: "int", nullable: false),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    estateId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_rubberPurchases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_rubberPurchases_companies_companyId",
                        column: x => x.companyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_rubberPurchases_estates_estateId",
                        column: x => x.estateId,
                        principalTable: "estates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                    table.ForeignKey(
                        name: "FK_rubberPurchases_sellers_sellerId",
                        column: x => x.sellerId,
                        principalTable: "sellers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateTable(
                name: "sellerCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    companyId = table.Column<int>(type: "int", nullable: false),
                    sellerId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sellerCompanies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sellerCompanies_companies_companyId",
                        column: x => x.companyId,
                        principalTable: "companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_sellerCompanies_sellers_sellerId",
                        column: x => x.sellerId,
                        principalTable: "sellers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.NoAction);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_buyerCompanies_buyerId",
                table: "buyerCompanies",
                column: "buyerId");

            migrationBuilder.CreateIndex(
                name: "IX_buyerCompanies_companyId",
                table: "buyerCompanies",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_buyers_estateId",
                table: "buyers",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_companies_ownershipId",
                table: "companies",
                column: "ownershipId");

            migrationBuilder.CreateIndex(
                name: "IX_companies_townId",
                table: "companies",
                column: "townId");

            migrationBuilder.CreateIndex(
                name: "IX_companyContacts_CompanyId",
                table: "companyContacts",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_costAmounts_costId",
                table: "costAmounts",
                column: "costId");

            migrationBuilder.CreateIndex(
                name: "IX_costAmounts_estateId",
                table: "costAmounts",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_costs_costCategoryId",
                table: "costs",
                column: "costCategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_costs_costSubcategory1Id",
                table: "costs",
                column: "costSubcategory1Id");

            migrationBuilder.CreateIndex(
                name: "IX_costs_costSubcategory2Id",
                table: "costs",
                column: "costSubcategory2Id");

            migrationBuilder.CreateIndex(
                name: "IX_costs_costTypeId",
                table: "costs",
                column: "costTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_estateContacts_EstateId",
                table: "estateContacts",
                column: "EstateId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_companyId",
                table: "estates",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_establishmentId",
                table: "estates",
                column: "establishmentId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_financialYearId",
                table: "estates",
                column: "financialYearId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_membershipTypeId",
                table: "estates",
                column: "membershipTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_estates_townId",
                table: "estates",
                column: "townId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldClones_cloneId",
                table: "fieldClones",
                column: "cloneId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldClones_fieldId",
                table: "fieldClones",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldConversions_fieldId",
                table: "fieldConversions",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfoYearly_fieldId",
                table: "fieldInfoYearly",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldInfoYearly_tappingSystemId",
                table: "fieldInfoYearly",
                column: "tappingSystemId");

            migrationBuilder.CreateIndex(
                name: "IX_fieldProductions_fieldId",
                table: "fieldProductions",
                column: "fieldId");

            migrationBuilder.CreateIndex(
                name: "IX_fields_estateId",
                table: "fields",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_fields_fieldDiseaseId",
                table: "fields",
                column: "fieldDiseaseId");

            migrationBuilder.CreateIndex(
                name: "IX_fields_fieldStatusId",
                table: "fields",
                column: "fieldStatusId");

            migrationBuilder.CreateIndex(
                name: "IX_foreignLabors_countryId",
                table: "foreignLabors",
                column: "countryId");

            migrationBuilder.CreateIndex(
                name: "IX_foreignLabors_estateId",
                table: "foreignLabors",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_localLabors_estateId",
                table: "localLabors",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_localLabors_laborTypeId",
                table: "localLabors",
                column: "laborTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_otherFields_cropTypeId",
                table: "otherFields",
                column: "cropTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_otherFields_estateId",
                table: "otherFields",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_productionComparisons_estateId",
                table: "productionComparisons",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberPurchases_companyId",
                table: "rubberPurchases",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberPurchases_estateId",
                table: "rubberPurchases",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberPurchases_sellerId",
                table: "rubberPurchases",
                column: "sellerId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSales_buyerId",
                table: "rubberSales",
                column: "buyerId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSales_companyId",
                table: "rubberSales",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_rubberSales_estateId",
                table: "rubberSales",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_sellerCompanies_companyId",
                table: "sellerCompanies",
                column: "companyId");

            migrationBuilder.CreateIndex(
                name: "IX_sellerCompanies_sellerId",
                table: "sellerCompanies",
                column: "sellerId");

            migrationBuilder.CreateIndex(
                name: "IX_sellers_estateId",
                table: "sellers",
                column: "estateId");

            migrationBuilder.CreateIndex(
                name: "IX_states_state",
                table: "states",
                column: "state",
                unique: true,
                filter: "[state] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_towns_stateId",
                table: "towns",
                column: "stateId");

            migrationBuilder.CreateIndex(
                name: "IX_workerShortages_estateId",
                table: "workerShortages",
                column: "estateId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "announcements");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "buyerCompanies");

            migrationBuilder.DropTable(
                name: "companyContacts");

            migrationBuilder.DropTable(
                name: "costAmounts");

            migrationBuilder.DropTable(
                name: "estateContacts");

            migrationBuilder.DropTable(
                name: "fieldClones");

            migrationBuilder.DropTable(
                name: "fieldConversions");

            migrationBuilder.DropTable(
                name: "fieldInfoYearly");

            migrationBuilder.DropTable(
                name: "fieldProductions");

            migrationBuilder.DropTable(
                name: "foreignLabors");

            migrationBuilder.DropTable(
                name: "historyLogs");

            migrationBuilder.DropTable(
                name: "localLabors");

            migrationBuilder.DropTable(
                name: "otherFields");

            migrationBuilder.DropTable(
                name: "plantingMaterials");

            migrationBuilder.DropTable(
                name: "productionComparisons");

            migrationBuilder.DropTable(
                name: "rubberPurchases");

            migrationBuilder.DropTable(
                name: "rubberSales");

            migrationBuilder.DropTable(
                name: "sellerCompanies");

            migrationBuilder.DropTable(
                name: "userActivityLogs");

            migrationBuilder.DropTable(
                name: "workerShortages");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "costs");

            migrationBuilder.DropTable(
                name: "clones");

            migrationBuilder.DropTable(
                name: "tappingSystems");

            migrationBuilder.DropTable(
                name: "fields");

            migrationBuilder.DropTable(
                name: "countries");

            migrationBuilder.DropTable(
                name: "localLaborTypes");

            migrationBuilder.DropTable(
                name: "cropTypes");

            migrationBuilder.DropTable(
                name: "buyers");

            migrationBuilder.DropTable(
                name: "sellers");

            migrationBuilder.DropTable(
                name: "costCategories");

            migrationBuilder.DropTable(
                name: "costSubcategories1");

            migrationBuilder.DropTable(
                name: "costSubcategories2");

            migrationBuilder.DropTable(
                name: "costTypes");

            migrationBuilder.DropTable(
                name: "fieldDiseases");

            migrationBuilder.DropTable(
                name: "fieldStatus");

            migrationBuilder.DropTable(
                name: "estates");

            migrationBuilder.DropTable(
                name: "companies");

            migrationBuilder.DropTable(
                name: "establishments");

            migrationBuilder.DropTable(
                name: "financialYears");

            migrationBuilder.DropTable(
                name: "membershipTypes");

            migrationBuilder.DropTable(
                name: "ownerships");

            migrationBuilder.DropTable(
                name: "towns");

            migrationBuilder.DropTable(
                name: "states");
        }
    }
}
