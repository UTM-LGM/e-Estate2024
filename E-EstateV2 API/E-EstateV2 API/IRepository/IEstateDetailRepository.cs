using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IEstateDetailRepository
    {
        Task<DTO_EstateDetail> GetEstateDetailbyEstateId(int estateId);
        Task<EstateDetail> AddEstateDetail(EstateDetail estate);
        Task<EstateDetail> UpdateEstateDetail(EstateDetail estate);
        Task<List<DTO_EstateDetail>> GetEstateDetails();
    }
}
