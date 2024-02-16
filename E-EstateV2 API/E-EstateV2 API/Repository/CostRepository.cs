using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class CostRepository:ICostRepository
    {
        private readonly ApplicationDbContext _context;

        public CostRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<DTO_Cost>> GetCostItems()
        {
            var cost = await _context.costs.Select(x => new DTO_Cost
            {
                id = x.Id,
                isMature = x.isMature,
                isActive = x.isActive,
                costTypes = _context.costTypes.Where(y => y.Id == x.costTypeId).Select(c => c.costType).FirstOrDefault(),
                costCategory = _context.costCategories.Where(y => y.Id == x.costCategoryId).Select(y => y.costCategory).FirstOrDefault(),
                costSubcategory1 = _context.costSubcategories1.Where(y => y.Id == x.costSubcategory1Id).Select(y => y.costSubcategory1).FirstOrDefault(),
                costSubcategory2 = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.costSubcategory2).FirstOrDefault(),
            }).ToListAsync();
            return cost;
        }

        public async Task<List<DTO_Cost>> GetCostIndirectByCostTypeId(int costTypeId)
        {
            var cost = await _context.costs.Where(x => x.isActive == true && x.costTypeId == costTypeId).Select(x => new DTO_Cost
            {
                id = x.Id,
                costSubcategory2Id = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.Id).FirstOrDefault(),
                costSubcategory2 = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.costSubcategory2).FirstOrDefault(),
            }).Distinct().ToListAsync();
            return cost;
        }

        public async Task<List<DTO_Cost>> GetCostCategoryM()
        {
            var costCat = await _context.costs.Where(x => x.isActive == true && x.isMature == true).Select(x => new DTO_Cost
            {
                costCategoryId = _context.costCategories.Where(y => y.Id == x.costCategoryId).Select(y => y.Id).FirstOrDefault(),
                costCategory = _context.costCategories.Where(y => y.Id == x.costCategoryId).Select(y => y.costCategory).FirstOrDefault(),
            }).Distinct().ToListAsync();
            return costCat;
        }

        public async Task<List<DTO_Cost>> GetCostSubCategoryM()
        {
            var costSub = await _context.costs.Where(x => x.isActive == true && x.isMature == true).Select(x => new DTO_Cost
            {
                id = x.Id,
                costSubcategory1Id = _context.costSubcategories1.Where(y => y.Id == x.costSubcategory1Id).Select(y => y.Id).FirstOrDefault(),
                costSubcategory1 = _context.costSubcategories1.Where(y => y.Id == x.costSubcategory1Id).Select(y => y.costSubcategory1).FirstOrDefault(),
                costCategoryId = _context.costCategories.Where(y => y.Id == x.costCategoryId).Select(y => y.Id).FirstOrDefault(),
                costSubcategory2 = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.costSubcategory2).FirstOrDefault(),

            }).OrderBy(x => x.costSubcategory1Id).ToListAsync();
            return costSub;
        }

        public async Task<List<DTO_Cost>> GetCostSubCategoryIM()
        {
            var costSub = await _context.costs.Where(x => x.isActive == true && x.isMature == false).Select(x => new DTO_Cost
            {
                id = x.Id,
                costSubcategory2Id = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.Id).FirstOrDefault(),
                costSubcategory2 = _context.costSubcategories2.Where(y => y.Id == x.costSubcategory2Id).Select(y => y.costSubcategory2).FirstOrDefault(),
            }).Distinct().ToListAsync();
            return costSub;
        }

        public async Task<Cost> AddCostItem(Cost cost)
        {
            cost.createdDate = DateTime.Now;
            await _context.costs.AddAsync(cost);
            await _context.SaveChangesAsync();
            return cost;
        }

        public async Task<Cost> UpdateCostItems(Cost cost)
        {
            var existingCost = await _context.costs.Where(x => x.Id == cost.Id).FirstOrDefaultAsync();
            if (existingCost != null)
            {
                existingCost.updatedBy = cost.updatedBy;
                existingCost.updatedDate = DateTime.Now;
                existingCost.isActive = cost.isActive;
                await _context.SaveChangesAsync();
                return existingCost;
            }
            return null;
        }
    }
}
