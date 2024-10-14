using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface ICompanyContactHistoryRepository
    {
        Task<CompanyContactHistory> AddCompanyContactHistory(CompanyContactHistory history);
    }
}
