using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class HistoryLogsController : ControllerBase
    {
        private readonly IGenericRepository<HistoryLog> _genericrepository;
        public HistoryLogsController(IGenericRepository<HistoryLog> genericRepository)
        {
            _genericrepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddHistoryLog([FromBody] HistoryLog historyLog)
        {
            historyLog.dateTime = DateTime.Now;
            var addedHistoryLog = await _genericrepository.Add(historyLog);
            return Ok(addedHistoryLog);
        }
    }
}
