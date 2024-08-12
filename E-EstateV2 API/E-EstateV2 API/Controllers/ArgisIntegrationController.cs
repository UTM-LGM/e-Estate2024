using E_EstateV2_API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    //[Authorize("ClientIdPolicy")]
    public class ArgisIntegrationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArgisIntegrationController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLandTitles()
        {
            var landTitle = await _context.grantTitles.Select(x => new
            {
                estateId = x.estateId,
                grantId = x.Id,
                grantTitle = x.grantTitle,
            }).ToListAsync();
            return Ok(landTitle);
        }
    }
}
