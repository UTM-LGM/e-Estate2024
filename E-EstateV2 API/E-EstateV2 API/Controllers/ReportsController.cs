using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly IReportRepository _reportRepository;

        public ReportsController(IReportRepository reportRepository)
        {
            _reportRepository = reportRepository;
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> ProductionYearlyByField(int year)
        {
            var productionYearly = await _reportRepository.GetProductionYearlyByField(year);
            return Ok(productionYearly);
        }

        [HttpGet]
        public async Task<IActionResult> CurrentProductions()
        {
           var currentProduction = await _reportRepository.GetCurrentProduction();  
            return Ok(currentProduction);

        }

        [HttpGet]
        [Route("{year:int}")]
        public IActionResult ProductionYearly(int year)
        {
            var productionYearly = _reportRepository.GetProductionYearly(year);
            return Ok(productionYearly);
        }

        [HttpGet]
        public async Task<IActionResult> CurrentLocalLabors()
        {
            var currentLocalLabor = await _reportRepository.GetCurrentLocalLabor();
            return Ok(currentLocalLabor);
        }

        [HttpGet]
        public async Task<IActionResult> CurrentForeignLabors()
        {
            var currentForeignLabor = await _reportRepository.GetCurrentForeignLabor();
            return Ok(currentForeignLabor);
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> ProductionYearlyByClone(int year)
        {
            var productionYearly = await _reportRepository.GetProductionYearlyByClone(year);
            return Ok(productionYearly);
        }
    }
}
