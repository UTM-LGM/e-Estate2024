using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class CompanyContactHistoryRepository:ICompanyContactHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public CompanyContactHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<CompanyContactHistory> AddCompanyContactHistory (CompanyContactHistory history)
        {
            await _context.companyContactHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
