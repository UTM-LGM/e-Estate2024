using E_EstateV2_API.Data;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.IRepository
{
    public interface ICompanyRepository
    {
        Task<List<DTO_Company>> GetCompanies();
        Task<DTO_Company> GetCompanyById(int id);
        Task<Company> UpdateCompany(Company company);
    }
}
