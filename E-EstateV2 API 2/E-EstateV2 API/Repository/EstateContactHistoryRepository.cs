using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class EstateContactHistoryRepository:IEstateContactHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public EstateContactHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<EstateContactHistory> AddEstateContactHistory (EstateContactHistory history)
        {
            await _context.estateContactHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
