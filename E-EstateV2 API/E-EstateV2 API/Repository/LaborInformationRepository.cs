using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class LaborInformationRepository: ILaborInformationRepository
    {
        private readonly ApplicationDbContext _context;

        public LaborInformationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LaborInfo> AddLaborInfo (LaborInfo laborInfo)
        {
            laborInfo.createdDate = DateTime.Now;
            await _context.laborInfos.AddAsync (laborInfo);
            await _context.SaveChangesAsync ();
            return laborInfo;
        }

        public async Task<List<DTO_LaborInfo>> GetLaborInfo ()
        {
            var labor = await _context.laborInfos.Select(x => new DTO_LaborInfo
            {
                id = x.Id,
                monthYear = x.monthYear,
                tapperCheckrole = x.tapperCheckrole,
                tapperContractor = x.tapperContractor,
                fieldCheckrole = x.fieldCheckrole,
                fieldContractor = x.fieldContractor,
                estateId = x.estateId,
                countryName = _context.countries.Where(y => y.Id == x.countryId).Select(y => y.country).FirstOrDefault(),
                isLocal = _context.countries.Where(y => y.Id == x.countryId).Select(y => y.isLocal).FirstOrDefault(),
                countryId = x.countryId,
                laborCategory = _context.laborByCategories.Where(y=>y.laborInfoId == x.Id).Select ( y=> new DTO_LaborByCategory
                {
                    id = y.Id,
                    noOfWorker = y.noOfWorker,
                    laborInfoId = y.laborInfoId,
                    laborTypeId = y.laborTypeId,
                    laborType = _context.laborTypes.Where(l => l.Id == y.laborTypeId).Select(y => y.laborType).FirstOrDefault(),
                    estateId = _context.laborInfos.Where(l => l.Id == y.laborInfoId).Select(y => y.estateId).FirstOrDefault()
                }).ToList()
            }).ToListAsync();
            return labor;
        }

        public async Task<LaborInfo> UpdateLaborInfo (LaborInfo laborInfo)
        {
            var existingLabor = await _context.laborInfos.Where(x=>x.Id == laborInfo.Id).FirstOrDefaultAsync();
            if (existingLabor != null)
            {
                existingLabor.updatedBy = laborInfo.updatedBy;
                existingLabor.updatedDate = DateTime.Now;
                existingLabor.fieldCheckrole = laborInfo.fieldCheckrole;
                existingLabor.fieldContractor = laborInfo.fieldContractor;
                existingLabor.tapperCheckrole = laborInfo.tapperCheckrole;
                existingLabor.tapperContractor = laborInfo.tapperContractor;
                await _context.SaveChangesAsync ();
                return laborInfo;
            }
            return null;
        }

        public async Task<LaborInfo> DeleteLaborInfo(int id)
        {
            var existingLabor = await _context.laborInfos.FirstOrDefaultAsync(c=>c.Id == id);
            if (existingLabor != null)
            {
                _context.laborInfos.Remove(existingLabor);
                await _context.SaveChangesAsync();
                return existingLabor;
            }
            return null;
        }
    }
}
