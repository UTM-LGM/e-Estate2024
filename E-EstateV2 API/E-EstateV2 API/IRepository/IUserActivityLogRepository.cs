using E_EstateV2_API.Models;

namespace E_EstateV2_API.IRepository
{
    public interface IUserActivityLogRepository
    {
        Task<UserActivityLog> AddActivityLog(UserActivityLog activityLog);
    }
}
