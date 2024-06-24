using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class CostAmountRepository : ICostAmountRepository
    {
        private readonly ApplicationDbContext _context;

        public CostAmountRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CostAmount>> AddCostAmount(CostAmount[] amount)
        {
            foreach (var item in amount)
            {
                item.createdDate = DateTime.Now;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return amount;
        }

        public async Task<List<DTO_CostAmount>> GetCostAmounts()
        {
            var amount = await _context.costAmounts.Select(x => new DTO_CostAmount
            {
                id = x.Id,
                amount = Math.Round(x.amount, 2),
                monthYear = x.monthYear,
                status = x.status,
                estateId = x.estateId,
                costId = x.costId,
                costSubcategory1Id = _context.costSubcategories1.Where(y => y.Id == (_context.costs.Where(c => c.Id == x.costId).Select(e => e.costSubcategory1Id).FirstOrDefault())).Select(y => y.Id).FirstOrDefault(),
                costSubcategory1 = _context.costSubcategories1.Where(y => y.Id == (_context.costs.Where(c => c.Id == x.costId).Select(e => e.costSubcategory1Id).FirstOrDefault())).Select(y => y.costSubcategory1).FirstOrDefault(),
                costSubcategory2 = _context.costSubcategories2.Where(y => y.Id == (_context.costs.Where(c => c.Id == x.costId).Select(e => e.costSubcategory2Id).FirstOrDefault())).Select(y => y.costSubcategory2).FirstOrDefault(),
                isMature = _context.costs.Where(y => y.Id == x.costId).Select(y => y.isMature).FirstOrDefault(),
                costType = _context.costTypes.Where(y => y.Id == (_context.costs.Where(c => c.Id == x.costId).Select(c => c.costTypeId).FirstOrDefault())).Select(y => y.costType).FirstOrDefault(),
                costTypeId = _context.costTypes.Where(y => y.Id == (_context.costs.Where(c => c.Id == x.costId).Select(c => c.costTypeId).FirstOrDefault())).Select(y => y.Id).FirstOrDefault(),
            }).OrderBy(x => x.costSubcategory1Id).ToListAsync();
            return amount;
        }

        public async Task<IEnumerable<CostAmount>> UpdateCostAmount(CostAmount[] amount)
        {
            foreach (var item in amount)
            {
                var existingAmount = await _context.costAmounts.FirstOrDefaultAsync(x => x.Id == item.Id);
                if (existingAmount != null)
                {
                    existingAmount.amount = item.amount;
                    existingAmount.status = item.status;
                    existingAmount.updatedBy = item.updatedBy;
                    existingAmount.updatedDate = DateTime.Now;
                    await _context.SaveChangesAsync();
                }
            }
            return amount;
        }
    }
}
