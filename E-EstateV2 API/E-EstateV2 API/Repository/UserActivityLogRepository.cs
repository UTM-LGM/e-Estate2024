using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;

namespace E_EstateV2_API.Repository
{
    public class UserActivityLogRepository:IUserActivityLogRepository
    {
        private readonly ApplicationDbContext _context;

        public UserActivityLogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserActivityLog> AddActivityLog(UserActivityLog activityLog)
        {
            //To get local server time
            activityLog.dateTime = DateTime.Now;
            await _context.userActivityLogs.AddAsync(activityLog);
            await _context.SaveChangesAsync();
            return activityLog;
        }
    }
}
