/*using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class renameDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Suppress transaction for the ALTER DATABASE statement
            migrationBuilder.Sql("ALTER DATABASE [e-Estate] MODIFY NAME = [RRIMestet]", suppressTransaction: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Suppress transaction for the rollback ALTER DATABASE statement
            migrationBuilder.Sql("ALTER DATABASE [RRIMestet] MODIFY NAME = [e-Estate]", suppressTransaction: true);
        }
    }
}*/


using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace E_EstateV2_API.Migrations
{
    public partial class renameDb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Set database to single-user mode and kill all connections
            migrationBuilder.Sql(@"
                USE master;
                ALTER DATABASE [e-Estate] 
                SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                ALTER DATABASE [e-Estate] MODIFY NAME = [RRIMestet];
                ALTER DATABASE [RRIMestet] SET MULTI_USER;
            ", suppressTransaction: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Set database to single-user mode and kill all connections for rollback
            migrationBuilder.Sql(@"
                USE master;
                ALTER DATABASE [RRIMestet] 
                SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
                ALTER DATABASE [RRIMestet] MODIFY NAME = [e-Estate];
                ALTER DATABASE [e-Estate] SET MULTI_USER;
            ", suppressTransaction: true);
        }
    }
}

