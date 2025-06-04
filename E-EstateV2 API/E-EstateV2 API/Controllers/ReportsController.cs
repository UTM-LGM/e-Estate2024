using E_EstateV2_API.IRepository;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> GetAllProductivityYearlyByClone(string start, string end)
        {
            var productionYearly = await _reportRepository.GetAllProductivityYearlyByClone(start,end);
            return Ok(productionYearly);
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetAreaByClone(int year)
        {
            var clone = await _reportRepository.GetAreaByClone(year);
            return Ok(clone);
        }

        [HttpGet]
        public async Task<IActionResult> GetAreaByAllClone(string start, string end)
        {
            var clone = await _reportRepository.GetAreaByAllClone(start, end);
            return Ok(clone);
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentField ()
        {
            var field = await _reportRepository.GetCurrentField();
            return Ok(field);
        }


        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> CurrentProductions(int year)
        {
            var currentProduction = await _reportRepository.GetCurrentProduction(year);
            return Ok(currentProduction);

        }

        [HttpGet]
        public async Task<IActionResult> GetProductions()
        {
            var getProductions = await _reportRepository.GetProduction();
            return Ok(getProductions);

        }

        [HttpGet]
        public async Task<IActionResult> GetSales()
        {
            var getSales = await _reportRepository.GetSales();
            return Ok(getSales);

        }

        [HttpGet]
        public async Task<IActionResult> GetStocks()
        {
            var getSales = await _reportRepository.GetStocks();
            return Ok(getSales);

        }

        //LGMAdmin
        [HttpGet]
        //[Route("{year:int}")]
        public async Task<IActionResult> GetProductivity()
        {
            var currentProductivity = await _reportRepository.GetProductivity();
            return Ok(currentProductivity);
        }

        //[HttpGet]

        //public async Task<IActionResult> GetStateFieldArea(string start, string end, int estateId)
        //{
        //    var fieldArea = await _reportRepository.GetStateFieldArea(start,end, estateId);
        //    return Ok(fieldArea);
        //}

        [HttpGet]
        [Route("{estateId:int}")]
        public async Task<IActionResult> GetStateFieldAreaById(int estateId)
        {
            var fieldArea = await _reportRepository.GetFieldsByEstateId(estateId);
            return Ok(fieldArea);
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetFieldArea(int year)
        {
            var fieldArea = await _reportRepository.GetFieldArea(year);
            return Ok(fieldArea);
        }

        //LGMAdmin
        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetCurrentTapperAndFieldWorker(int year)
        {
            var worker = await _reportRepository.GetLatestMonthWorker(year);
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
        [Route("{year:int}")]
        public async Task<IActionResult> GetLaborInformationCategory(int year)
        {
            var labor = await _reportRepository.GetLaborInformationCategory(year);
            return Ok(labor);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLaborInformationCategory(string start, string end)
        {
            var labor = await _reportRepository.GetAllLaborInformationCategory(start, end);
            return Ok(labor);
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldAreaByDate(string start, string end, int estateId)
        {
            var area = await _reportRepository.GetFieldAreaByDate(start, end, estateId);
            return Ok(area);

        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetTapperAndFieldWorker(int year)
        {
            var labor = await _reportRepository.GetTapperAndFieldWorker(year);
            return Ok(labor);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTapperAndFieldWorker(string start, string end)
        {
            var labor = await _reportRepository.GetAllTapperAndFieldWorker(start, end);
            return Ok(labor);
        }




        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetWorkerShortageEstate(int year)
        {
            var worker = await _reportRepository.GetWorkerShortageEstate(year);
            return Ok(worker);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWorkerShortageEstate(string start, string end)
        {
            var worker = await _reportRepository.GetAllWorkerShortageEstate(start,end);
            return Ok(worker);
        }

        [HttpGet]
        [Route("{year:int}")]

        public async Task<IActionResult> GetCostInformation(int year)
        {
            var cost = await _reportRepository.GetCostInformation(year);
            return Ok(cost);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCostInformation(string start, string end)
        {
            var cost = await _reportRepository.GetAllCostInformation(start, end);
            return Ok(cost);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRubberSale(string start, string end)
        {
            var rubberSale = await _reportRepository.GetAllRubberSale(start, end);
            return Ok(rubberSale);
        }
    }
}
