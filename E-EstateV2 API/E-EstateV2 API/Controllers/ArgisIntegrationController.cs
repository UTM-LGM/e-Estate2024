using E_EstateV2_API.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
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
            var landTitle = await _context.fieldGrants.Select(x => new
            {
                estateId = _context.fields.Where(y => y.Id == x.fieldId).Select(y => y.estateId).FirstOrDefault(),
                grantId = x.Id,
                grantTitle = x.grantTitle,
            }).ToListAsync();
            return Ok(landTitle);
        }
    }
}
