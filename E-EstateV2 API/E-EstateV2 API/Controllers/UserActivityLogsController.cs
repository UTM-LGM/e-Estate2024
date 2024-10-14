using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class UserActivityLogsController : ControllerBase
    {
        private readonly IUserActivityLogRepository _activityLogRepository;

        public UserActivityLogsController(IUserActivityLogRepository activityLogRepository)
        {
            _activityLogRepository = activityLogRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddActivityLog([FromBody] UserActivityLog activityLog)
        {
            var result = await _activityLogRepository.AddActivityLog(activityLog);
            return Ok(result);
        }
    }
}
