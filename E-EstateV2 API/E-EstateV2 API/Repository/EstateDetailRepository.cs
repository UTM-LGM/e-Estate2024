using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class EstateDetailRepository: IEstateDetailRepository
    {
        private readonly ApplicationDbContext _context;

        public EstateDetailRepository(ApplicationDbContext context)
        {
              _context = context;
        }

        public async Task<DTO_EstateDetail> GetEstateDetailbyEstateId(int estateId)
        {
            var estate = await _context.estateDetails.Where(x => x.estateId == estateId).Select(x => new DTO_EstateDetail
            {
                id = x.Id,
                estateId = x.estateId,
                grantNo = x.grantNo,
                plantingMaterialId = x.plantingMaterialId,
                plantingMaterial = _context.plantingMaterials.Where(y => y.Id == x.plantingMaterialId).Select(y => y.plantingMaterial).FirstOrDefault()
            }).FirstOrDefaultAsync();
            return estate;
        }


        public async Task<List<DTO_EstateDetail>> GetEstateDetails()
        {
            var estateDetails = await _context.estateDetails.GroupBy(e => e.estateId).Select(g => new DTO_EstateDetail
            {
                estateId = g.Key,
            }).ToListAsync();
            return estateDetails;
        }

        public async Task<EstateDetail> AddEstateDetail(EstateDetail estate)
        {
            estate.createdDate = DateTime.Now;
            await _context.estateDetails.AddAsync(estate);
            await _context.SaveChangesAsync();
            return estate;
        }

        public async Task<EstateDetail> UpdateEstateDetail (EstateDetail estate)
        {
            var existingEstateDetail = await _context.estateDetails.Where(x => x.Id == estate.Id).FirstOrDefaultAsync();
            if (existingEstateDetail != null)
            {
                existingEstateDetail.updatedBy = estate.updatedBy;
                existingEstateDetail.updatedDate = DateTime.Now;
                existingEstateDetail.grantNo = estate.grantNo;
                existingEstateDetail.plantingMaterialId = estate.plantingMaterialId;
                await _context.SaveChangesAsync();
                return existingEstateDetail;
            }
            return null;
        }
    }
}
