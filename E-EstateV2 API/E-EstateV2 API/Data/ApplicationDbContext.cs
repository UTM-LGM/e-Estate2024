using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Add a unique constraint for the StateName column in the States table
            modelBuilder.Entity<State>()
                .HasIndex(s => s.state)
                .IsUnique();
        }

        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Company> companies { get; set; }
        public DbSet<Estate> estates { get; set; }
        public DbSet<Establishment> establishments { get; set; }
        public DbSet<FinancialYear> financialYears { get; set; }
        public DbSet<MembershipType> membershipTypes { get; set; }
        public DbSet<State> states { get; set; }
        public DbSet<Town> towns { get; set; }
        public DbSet<FieldStatus> fieldStatus { get; set; }
        public DbSet<Clone> clones { get; set; }
        public DbSet<Field> fields { get; set; }
        public DbSet<FieldClone> fieldClones { get; set; }
        public DbSet<Country> countries { get; set; }
        public DbSet<LocalLabor> localLabors { get; set; }
        public DbSet<LaborType> laborTypes { get; set; }
        public DbSet<CostType> costTypes { get; set; }
        public DbSet<CostCategory> costCategories { get; set; }
        public DbSet<CostSubcategory1> costSubcategories1 { get; set; } 
        public DbSet<CostSubcategory2> costSubcategories2 { get; set; }
        public DbSet<Cost> costs { get; set; }
        public DbSet<CostAmount> costAmounts { get; set; }
        public DbSet<FieldProduction> fieldProductions { get; set; }
        public DbSet<UserActivityLog> userActivityLogs { get; set; }
        public DbSet<Buyer> buyers { get; set; }
        public DbSet<RubberSales> rubberSales { get; set; }
        public DbSet<RubberPurchase> rubberPurchases { get; set; }
        public DbSet<BuyerCompany> buyerCompanies { get; set; }
        public DbSet<SellerCompany> sellerCompanies { get; set; }
        public DbSet<Seller> sellers { get; set; }
        public DbSet<FieldConversion> fieldConversions { get; set; }
        public DbSet<ProductionComparison> productionComparisons { get; set;}
        public DbSet<Announcement> announcements { get; set; }
        public DbSet<HistoryLog> historyLogs { get; set; }
        public DbSet<FieldInfoYearly> fieldInfoYearly { get; set; }
        public DbSet<WorkerShortage> workerShortages { get; set; }
        public DbSet<Ownership> ownerships { get; set; }
        public DbSet<TappingSystem> tappingSystems { get; set; }
        public DbSet<FieldDisease> fieldDiseases { get; set; }
        public DbSet<CropType> cropTypes { get; set; }
        public DbSet<OtherField> otherFields { get; set; }
        public DbSet<CompanyContact> companyContacts { get; set; }
        public DbSet<EstateContact> estateContacts { get; set; }
        public DbSet<PlantingMaterial> plantingMaterials { get; set; }
        public DbSet<FieldInfected> fieldInfecteds { get; set; }
        public DbSet<EstateDetail> estateDetails { get; set; }
        public DbSet<PaymentStatus> paymentStatuses { get; set; }
        public DbSet<CompanyDetail> companyDetails { get; set; }
        public DbSet<LaborInfo> laborInfos { get; set; }
        public DbSet<LaborByCategory> laborByCategories { get; set; }
        public DbSet<RubberStock> rubberStocks { get; set;}
    }

}
