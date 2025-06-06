using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class LaborByCategoryRepository: ILaborByCategoryRepository
    {
        private readonly ApplicationDbContext _context;

        public LaborByCategoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<LaborByCategory>> AddLaborByCategory (LaborByCategory[] laborByCategory)
        {
            foreach (var item in laborByCategory)
            {
                item.createdDate = DateTime.Now;
                await _context.laborByCategories.AddAsync(item);
                await _context.SaveChangesAsync();
            }           
            return laborByCategory;
        }

        public async Task<DTO_LaborByCategory> GetLaborByCategoriesByLaborInfoId (int id)
        {
            var labor = await _context.laborByCategories.Where(x=>x.laborInfoId == id).Select(x => new DTO_LaborByCategory
            {
                id = x.Id,
                noOfWorker = x.noOfWorker,
                laborInfoId = x.laborInfoId,
                laborTypeId = x.laborTypeId,
                laborType = _context.laborTypes.Where(y => y.Id == x.laborTypeId).Select(y=>y.laborType).FirstOrDefault(),
                estateId = _context.laborInfos.Where(y => y.Id == x.laborInfoId).Select(y => y.estateId).FirstOrDefault()
            }).FirstOrDefaultAsync();
            return labor;
        }

        public async Task<IEnumerable<LaborByCategory>> UpdateLaborCategory (LaborByCategory[] laborByCategory)
        {
            foreach (var labor in laborByCategory)
            {
                var existing = await _context.laborByCategories.Where(x => x.Id == labor.Id).FirstOrDefaultAsync();
                if (existing != null)
                {
                    existing.noOfWorker = labor.noOfWorker;
                    existing.updatedBy = labor.updatedBy;
                    existing.updatedDate = DateTime.Now;
                    await _context.SaveChangesAsync();
                }
            }         
            return laborByCategory;
        }

        public async Task<List<DTO_LaborByCategory>> GetLaborByCategories()
        {
            var labor = await _context.laborByCategories.Select(x => new DTO_LaborByCategory
            {
                id = x.Id,
                noOfWorker = x.noOfWorker,
                laborInfoId = x.laborInfoId,
                laborTypeId = x.laborTypeId,
                laborType = _context.laborTypes.Where(y => y.Id == x.laborTypeId).Select(y => y.laborType).FirstOrDefault(),
                estateId = _context.laborInfos.Where(y=>y.Id == x.laborInfoId).Select(y=>y.estateId).FirstOrDefault()
            }).ToListAsync();
            return labor;
        }

        public async Task<IEnumerable<LaborByCategory>> DeleteLaborCategory(int laborInfoId)
        {
            var laborToDelete = await _context.laborByCategories.Where(x => x.laborInfoId == laborInfoId).ToListAsync();
            if(laborToDelete.Any())
            {
                _context.laborByCategories.RemoveRange(laborToDelete);
                await _context.SaveChangesAsync();
                return laborToDelete;
            }
            return null;
        }
    }
}
