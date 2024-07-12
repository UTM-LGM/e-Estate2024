using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class FieldHistoryRepository:IFieldHistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public FieldHistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<FieldHistory>AddFieldHistory(FieldHistory history)
        {
            await _context.fieldHistories.AddAsync(history);
            await _context.SaveChangesAsync();
            return history;
        }
    }
}
