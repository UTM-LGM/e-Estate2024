using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace E_EstateV2_API.Controllers
{
    //[Authorize(AuthenticationSchemes = AzureADDefaults.BearerAuthenticationScheme, Policy = "AdminPolicy")]
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
        [Route("{year:int}")]
        public async Task<IActionResult> ProductivityYearlyByClone(int year)
        {
            var productionYearly = await _reportRepository.GetProductivityYearlyByClone(year);
            return Ok(productionYearly);
        }


        [HttpGet]
        public async Task<IActionResult> CurrentProductions()
        {
            var currentProduction = await _reportRepository.GetCurrentProduction();
            return Ok(currentProduction);

        }

        //LGMAdmin
        [HttpGet]
        //[Route("{year:int}")]
        public async Task<IActionResult> GetProductivity()
        {
            var currentProductivity = await _reportRepository.GetProductivity();
            return Ok(currentProductivity);
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldArea()
        {
            var fieldArea = await _reportRepository.GetFieldArea();
            return Ok(fieldArea);
        }

        //LGMAdmin
        [HttpGet]
        public async Task<IActionResult> GetCurrentTapperAndFieldWorker()
        {
            var worker = await _reportRepository.GetLatestMonthWorker();
            return Ok(worker);
        }

        [HttpGet]
        [Route("{year:int}")]
        public IActionResult ProductionYearly(int year)
        {
            var productionYearly = _reportRepository.GetProductionYearly(year);
            return Ok(productionYearly);
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> ProductionYearlyByClone(int year)
        {
            var productionYearly = await _reportRepository.GetProductionYearlyByClone(year);
            return Ok(productionYearly);
        }

        [HttpGet]
        public async Task<IActionResult> GetLaborInformationCategory()
        {
            var labor = await _reportRepository.GetLaborInformationCategory();
            return Ok(labor);
        }

        [HttpGet]
        public async Task<IActionResult> GetTapperAndFieldWorker()
        {
            var labor = await _reportRepository.GetTapperAndFieldWorker();
            return Ok(labor);
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkerShortageEstate()
        {
            var worker = await _reportRepository.GetWorkerShortageEstate();
            return Ok(worker);
        }

        [HttpGet]
        [Route("{year:int}")]

        public async Task<IActionResult> GetCostInformation(int year)
        {
            var cost = await _reportRepository.GetCostInformation(year);
            return Ok(cost);
        }
    }
}
