using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class LocalLaborRepository:ILocalLaborRepository
    {
        private readonly ApplicationDbContext _context;

        public LocalLaborRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<LocalLabor>> AddLocalLabor(LocalLabor[] localLabor)
        {
            foreach (var item in localLabor)
            {
                item.createdDate = DateTime.Now;
                await _context.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return localLabor;
        }

        /*public async Task<List<DTO_LocalLabor>> GetLocalLabors()
        {
            var labor = await _context.localLabors.Select(x => new DTO_LocalLabor
            {
                id = x.Id,
                laborTypeId = x.laborTypeId,
                laborTypeName = _context.laborTypes.Where(y => y.Id == x.laborTypeId).Select(y => y.laborType).FirstOrDefault(),
                monthYear = x.monthYear,
                totalWorker = x.totalWorker,
                estateId = x.estateId,
                laborType = _context.laborTypes.Where(y => y.Id == x.laborTypeId).Select(y => y.laborType).FirstOrDefault()
            }).ToListAsync();
            return labor;
        }

        public async Task<LocalLabor> UpdateLocalLabor(LocalLabor localLabor)
        {
            var existingLabor = await _context.localLabors.FirstOrDefaultAsync(x => x.Id == localLabor.Id);
            if (existingLabor != null)
            {
                existingLabor.totalWorker = localLabor.totalWorker;
                existingLabor.updatedBy = localLabor.updatedBy;
                existingLabor.updatedDate = DateTime.Now;
                await _context.SaveChangesAsync();
                return existingLabor;
            }
            return null;
        }*/
    }
}
