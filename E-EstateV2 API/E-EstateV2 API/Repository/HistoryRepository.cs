using E_EstateV2_API.Data;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class HistoryRepository
    {
        private readonly ApplicationDbContext _context;

        public HistoryRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<HistoryLog> AddHistoryLog (HistoryLog log)
        {
            log.dateTime = DateTime.Now;
            await _context.historyLogs.AddAsync(log);
            await _context.SaveChangesAsync();
            return log;
        }

    }
}
