using E_EstateV2_API.DTO;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface ICompanyDetailRepository
    {
        Task<DTO_CompanyDetail> GetCompanyDetailByCompanyId(int companyId);
        Task<CompanyDetail> AddCompanyDetail(CompanyDetail companyDetail);
        Task<CompanyDetail> UpdateCompanyDetail(CompanyDetail company);
    }
}
