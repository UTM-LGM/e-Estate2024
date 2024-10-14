using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface ICountryRepository:IGenericRepository<Country>
    {
        Task<List<Country>> GetCountriesAsc();
    }
}
