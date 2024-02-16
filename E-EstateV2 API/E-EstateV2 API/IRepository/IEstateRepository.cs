using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface IEstateRepository
    {
        Task<List<DTO_Estate>> GetEstates();
        Task<DTO_Estate> GetEstateById(int id);
        Task<Estate> AddEstate(Estate estate);
        Task<Estate> UpdateEstate(Estate estate);
        Task<Object> CheckEstateName(string estateName);
    }
}
