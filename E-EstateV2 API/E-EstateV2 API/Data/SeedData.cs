using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Identity;

namespace E_EstateV2_API.Data
{
    public class SeedData
    {
        public static async Task PopulateDb(IApplicationBuilder app)
        {
            using var servicesScope = app.ApplicationServices.CreateScope();
            var context = servicesScope.ServiceProvider.GetService<ApplicationDbContext>();
            var roleManager = servicesScope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

            if (context == null || roleManager == null)
            {
                return; // Exit if context or roleManager is null
            }

            await AddPaymentStatus(context);
            await AddPlantingMaterial(context);
            await AddRubberDisease(context);
            await AddMembership(context);
            await AddOtherCrop(context);
            await AddCostType(context);
            await AddlaborType(context);
            await AddFieldStatus(context);
            await AddCountry(context);
            await AddCostCategory(context);
            await AddCostCategory1(context);
            await AddCostCategory2(context);
            await AddCost(context);
            await AddRoles(roleManager);
        }

        private static async Task AddPaymentStatus(ApplicationDbContext context)
        {
            // Seed payment status table
            if (!context.paymentStatuses.Any(ps => ps.status == "LETTER OF CONSENT"))
            {
                context.paymentStatuses.Add(new PaymentStatus { status = "LETTER OF CONSENT" });
            }

            if (!context.paymentStatuses.Any(ps => ps.status == "WEIGHT SLIP NO"))
            {
                context.paymentStatuses.Add(new PaymentStatus { status = "WEIGHT SLIP NO" });
            }

            if (!context.paymentStatuses.Any(ps => ps.status == "RECEIPT NO"))
            {
                context.paymentStatuses.Add(new PaymentStatus { status = "RECEIPT NO" });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddRoles(RoleManager<IdentityRole> roleManager)
        {
            // Seed roles
            if (!(await roleManager.RoleExistsAsync("Admin")))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }
            if (!(await roleManager.RoleExistsAsync("CompanyAdmin")))
            {
                await roleManager.CreateAsync(new IdentityRole("CompanyAdmin"));
            }

            if (!(await roleManager.RoleExistsAsync("EstateClerk")))
            {
                await roleManager.CreateAsync(new IdentityRole("EstateClerk"));
            }
        }

        private static async Task AddPlantingMaterial(ApplicationDbContext context)
        {
            // seed planting material
            if (!context.plantingMaterials.Any(ps => ps.plantingMaterial == "OWN NURSERY"))
            {
                context.plantingMaterials.Add(new PlantingMaterial { plantingMaterial = "OWN NURSERY", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.plantingMaterials.Any(ps => ps.plantingMaterial == "OTHER NURSERY"))
            {
                context.plantingMaterials.Add(new PlantingMaterial { plantingMaterial = "OTHER NURSERY", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddRubberDisease(ApplicationDbContext context)
        {
            // seed field disease
            if (!context.fieldDiseases.Any(ps => ps.diseaseName == "ROOT DISEASE"))
            {
                context.fieldDiseases.Add(new FieldDisease { diseaseName = "ROOT DISEASE", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldDiseases.Any(ps => ps.diseaseName == "STEM DISEASE"))
            {
                context.fieldDiseases.Add(new FieldDisease { diseaseName = "STEM DISEASE", isActive = true, createdBy = "SYSTEM GENERATED" });
            }


            if (!context.fieldDiseases.Any(ps => ps.diseaseName == "BROWN DISEASE"))
            {
                context.fieldDiseases.Add(new FieldDisease { diseaseName = "BROWN DISEASE", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldDiseases.Any(ps => ps.diseaseName == "LEAF DISEASE"))
            {
                context.fieldDiseases.Add(new FieldDisease { diseaseName = "LEAF DISEASE", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddMembership(ApplicationDbContext context)
        {
            // Seed membership
            if (!context.membershipTypes.Any(ps => ps.membershipType == "MAPA"))
            {
                context.membershipTypes.Add(new MembershipType { membershipType = "MAPA", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.membershipTypes.Any(ps => ps.membershipType == "NON MAPA"))
            {
                context.membershipTypes.Add(new MembershipType { membershipType = "NON MAPA", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddOtherCrop(ApplicationDbContext context)
        {
            // Seed otherCrop
            if (!context.otherCrops.Any(ps => ps.otherCrop == "PALM OIL"))
            {
                context.otherCrops.Add(new OtherCrop { otherCrop = "PALM OIL", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.otherCrops.Any(ps => ps.otherCrop == "DURIAN"))
            {
                context.otherCrops.Add(new OtherCrop { otherCrop = "DURIAN", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.otherCrops.Any(ps => ps.otherCrop == "COCOA"))
            {
                context.otherCrops.Add(new OtherCrop { otherCrop = "COCOA", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.otherCrops.Any(ps => ps.otherCrop == "FRUIT FARM"))
            {
                context.otherCrops.Add(new OtherCrop { otherCrop = "FRUIT FARM", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCostType(ApplicationDbContext context)
        {
            // Seed cost type
            if (!context.costTypes.Any(ps => ps.costType == "DIRECT COST"))
            {
                context.costTypes.Add(new CostType { costType = "DIRECT COST", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costTypes.Any(ps => ps.costType == "INDIRECT COST"))
            {
                context.costTypes.Add(new CostType { costType = "INDIRECT COST", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddlaborType(ApplicationDbContext context)
        {
            // Seed labor type

            /*if (!context.laborTypes.Any(ps => ps.laborType == "CHECKROLE TAPPER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "CHECKROLE TAPPER", isActive = true });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "EMPLOYED TAPPER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "EMPLOYED TAPPER", isActive = true });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "CHECKROLE FIELD WORKER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "CHECKROLE FIELD WORKER", isActive = true });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "EMPLOYED FIELD WORKER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "EMPLOYED FIELD WORKER", isActive = true });
            ^*/

            if (!context.laborTypes.Any(ps => ps.laborType == "MANAGEMENT AND PROFESSIONAL"))
            {
                context.laborTypes.Add(new LaborType { laborType = "MANAGEMENT AND PROFESSIONAL", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "TECHNICAL AND ADVISORY"))
            {
                context.laborTypes.Add(new LaborType { laborType = "TECHNICAL AND ADVISORY", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "CLERICAL AND RELATED POSITION"))
            {
                context.laborTypes.Add(new LaborType { laborType = "CLERICAL AND RELATED POSITION", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "GENERAL WORKER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "GENERAL WORKER", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "FACTORY WORKER"))
            {
                context.laborTypes.Add(new LaborType { laborType = "FACTORY WORKER", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.laborTypes.Any(ps => ps.laborType == "OTHERS"))
            {
                context.laborTypes.Add(new LaborType { laborType = "OTHERS", isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddFieldStatus(ApplicationDbContext context)
        {
            // Seed field status
            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "TAPPED AREA"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "TAPPED AREA", isMature = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "CONVERSION TO OTHER CROP/NON-AGRI USED"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "CONVERSION TO OTHER CROP/NON-AGRI USED", isMature = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "ABANDONED - TAPPED"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "ABANDONED - TAPPED", isMature = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "ABANDONED - UNTAPPED"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "ABANDONED - UNTAPPED", isMature = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "ACQUIRED BY GOVERNMENT"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "ACQUIRED BY GOVERNMENT", isMature = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "NEW PLANTING"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "NEW PLANTING", isMature = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "REPLANTING"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "REPLANTING", isMature = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "CONVERSION OTHER CROP TO RUBBER"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "CONVERSION OTHER CROP TO RUBBER", isMature = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "ABANDONED"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "ABANDONED", isMature = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            if (!context.fieldStatus.Any(ps => ps.fieldStatus == "ACQUIRED BY GOVERNMENT"))
            {
                context.fieldStatus.Add(new FieldStatus { fieldStatus = "ACQUIRED BY GOVERNMENT", isMature = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }
            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCountry(ApplicationDbContext context)
        {
            // Seed çountry
            if (!context.countries.Any(ps => ps.country == "MALAYSIA"))
            {
                context.countries.Add(new Country { country = "MALAYSIA", isLocal = true, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "INDONESIA"))
            {
                context.countries.Add(new Country { country = "INDONESIA", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "BANGLADESH"))
            {
                context.countries.Add(new Country { country = "BANGLADESH", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "INDIA"))
            {
                context.countries.Add(new Country { country = "INDIA", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "THAILAND"))
            {
                context.countries.Add(new Country { country = "THAILAND", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "NEPAL"))
            {
                context.countries.Add(new Country { country = "NEPAL", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "MYANMAR"))
            {
                context.countries.Add(new Country { country = "MYANMAR", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "VIETNAM"))
            {
                context.countries.Add(new Country { country = "VIETNAM", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.countries.Any(ps => ps.country == "OTHERS"))
            {
                context.countries.Add(new Country { country = "OTHERS", isLocal = false, isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCostCategory(ApplicationDbContext context)
        {
            // Seed cost categories
            if (!context.costCategories.Any(ps => ps.costCategory == "Upkeep and Cultivation"))
            {
                context.costCategories.Add(new CostCategory { costCategory = "Upkeep and Cultivation", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costCategories.Any(ps => ps.costCategory == "Tapping and Collection"))
            {
                context.costCategories.Add(new CostCategory { costCategory = "Tapping and Collection", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costCategories.Any(ps => ps.costCategory == "Stimulation"))
            {
                context.costCategories.Add(new CostCategory { costCategory = "Stimulation", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costCategories.Any(ps => ps.costCategory == "Transport to Factory"))
            {
                context.costCategories.Add(new CostCategory { costCategory = "Transport to Factory", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costCategories.Any(ps => ps.costCategory == "N/A"))
            {
                context.costCategories.Add(new CostCategory { costCategory = "N/A", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCostCategory1(ApplicationDbContext context)
        {
            // Seed cost subCategory1
            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Manuring"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Manuring", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Weeding"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Weeding", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Others( Pest and disease control)"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Others( Pest and disease control)", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Tapping and Collection"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Tapping and Collection", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Stimulation"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Stimulation", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "Transport to Factory"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "Transport to Factory", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories1.Any(ps => ps.costSubcategory1 == "N/A"))
            {
                context.costSubcategories1.Add(new CostSubcategory1 { costSubcategory1 = "N/A", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCostCategory2(ApplicationDbContext context)
        {
            // Seed cost subCategory2
            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Material"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Material", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Labour"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Labour", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Total"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Total", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Clearing, planting and any direct maintenance expenditure incurred on area new planted with rubber"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Clearing, planting and any direct maintenance expenditure incurred on area new planted with rubber", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Direct maintenance expenditure in respect of all immature rubber area replanted/new planted in this year or earlier"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Direct maintenance expenditure in respect of all immature rubber area replanted/new planted in this year or earlier", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Managerial and administration staff salaries, allowances and other expenses"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Managerial and administration staff salaries, allowances and other expenses", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Maintenance of buildings and other permanents fixtures"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Maintenance of buildings and other permanents fixtures", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Depreciation of buildings and other permanents fixtures"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Depreciation of buildings and other permanents fixtures", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Fees, quit rents, assesments, land cess, rent, insurance and other payment"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Fees, quit rents, assesments, land cess, rent, insurance and other payment", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Labour expenses"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Labour expenses", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Head office charges (if any)"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Head office charges (if any)", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            if (!context.costSubcategories2.Any(ps => ps.costSubcategory2 == "Others (including general office overheads)"))
            {
                context.costSubcategories2.Add(new CostSubcategory2 { costSubcategory2 = "Others (including general office overheads)", isActive = true, createdBy = "SYSTEM GENERATED" });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }

        private static async Task AddCost(ApplicationDbContext context)
        {
            // Seed costs
            if (!context.costs.Any(ps => ps.costSubcategory1Id == 1))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 1, costSubcategory2Id = 1 });
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 1, costSubcategory2Id = 2 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory1Id == 2))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 2, costSubcategory2Id = 1 });
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 2, costSubcategory2Id = 2 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory1Id == 3))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 3, costSubcategory2Id = 1 });
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 1, costSubcategory1Id = 3, costSubcategory2Id = 2 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory1Id == 4))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 2, costSubcategory1Id = 4, costSubcategory2Id = 1 });
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 2, costSubcategory1Id = 4, costSubcategory2Id = 2 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory1Id == 5))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 3, costSubcategory1Id = 5, costSubcategory2Id = 1 });
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 3, costSubcategory1Id = 5, costSubcategory2Id = 2 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory1Id == 6))
            {
                context.costs.Add(new Cost { isMature = true, isActive = true, costTypeId = 1, costCategoryId = 4, costSubcategory1Id = 6, costSubcategory2Id = 3 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 4))
            {
                context.costs.Add(new Cost { isMature = false, isActive = true, costTypeId = 1, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 4 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 5))
            {
                context.costs.Add(new Cost { isMature = false, isActive = true, costTypeId = 1, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 5 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 6))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 6 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 7))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 7 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 8))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 8 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 9))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 9 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 10))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 10 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 11))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 11 });
            }

            if (!context.costs.Any(ps => ps.costSubcategory2Id == 12))
            {
                context.costs.Add(new Cost { isMature = null, isActive = true, costTypeId = 2, costCategoryId = 5, costSubcategory1Id = 7, costSubcategory2Id = 12 });
            }

            await context.SaveChangesAsync(); // Save changes to the database
        }




    }
}
