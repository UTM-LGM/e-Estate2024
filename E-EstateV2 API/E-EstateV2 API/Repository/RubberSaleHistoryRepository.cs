using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class RubberSaleHistoryRepository:IRubberSaleHistoryRepository
    {
        private readonly ApplicationDbContext _context;
        public RubberSaleHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RubberSaleHistory> AddRubberSaleHistory (RubberSaleHistory history)
        {
            await _context.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
