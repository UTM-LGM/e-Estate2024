using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FinancialYearsController : ControllerBase
    {
        private readonly IGenericRepository<FinancialYear> _genericRepository;

        public FinancialYearsController(IGenericRepository<FinancialYear> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFinancialYears()
        {
            var financialYears = await _genericRepository.GetAll();
            return Ok(financialYears);
        }

        [HttpPost]
        public async Task<IActionResult> AddFinancialYear([FromBody] FinancialYear financialYear)
        {
            financialYear.createdDate = DateTime.Now;
            var addedFinancialYear = await _genericRepository.Add(financialYear);
            return Ok(addedFinancialYear);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFinancialYear([FromBody] FinancialYear financialYear)
        {
            financialYear.updatedDate = DateTime.Now;
            var updatedFinancialYears = await _genericRepository.Update(financialYear);
            return Ok(updatedFinancialYears);
        }
    }
}
