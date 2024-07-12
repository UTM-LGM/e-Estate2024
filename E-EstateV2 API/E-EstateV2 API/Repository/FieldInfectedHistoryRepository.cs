using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class FieldInfectedHistoryRepository:IFieldInfectedHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldInfectedHistoryRepository(ApplicationDbContext context)
        {
              _context = context;
        }

        public async Task<FieldInfectedHistory> AddFieldInfectedHistory (FieldInfectedHistory history)
        {
            await _context.fieldInfectedHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
