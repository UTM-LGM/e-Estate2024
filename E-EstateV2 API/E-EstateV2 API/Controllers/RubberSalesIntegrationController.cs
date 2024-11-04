using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RubberSalesIntegrationController : ControllerBase
    {
        private readonly IRubberSaleIntegrationRepository _rubberSaleIntegrationRepository;

        public RubberSalesIntegrationController(IRubberSaleIntegrationRepository repository)
        {
            _rubberSaleIntegrationRepository = repository;
        }

        [HttpGet]
        //[Route("{LOC}/{buyerLicenseNo}")]
        public async Task<IActionResult> GetRubberSaleByLOC(string LOC, string buyerLicenseNo)
        {
            var rubberSale = await _rubberSaleIntegrationRepository.GetRubberSaleByLOC(LOC, buyerLicenseNo);
            return Ok(rubberSale);
        }


        [HttpPut]
        [Route("{LOC}")]
        public async Task<IActionResult> UpdateWeightSlipNo(string LOC, RubberSales rubberSales)
        {
            var updatedSale = await _rubberSaleIntegrationRepository.UpdateWeightSlipNo(LOC, rubberSales);
            return Ok(updatedSale);
        }

        [HttpPut]
        [Route("{LOC}")]

        public async Task<IActionResult> UpdateReceiptNo(string LOC, RubberSales rubberSales)
        {
            var updatedSale = await _rubberSaleIntegrationRepository.UpdateReceiptNo(LOC, rubberSales);
            return Ok(updatedSale);
        }

        [HttpPut]
        [Route("{LOC}")]

        public async Task<IActionResult> UpdateReceiptNoRimNiaga(string LOC, RubberSales rubberSales)
        {
            var updatedSale = await _rubberSaleIntegrationRepository.UpdateReceiptNoRimNiaga(LOC, rubberSales);
            return Ok(updatedSale);
        }

    }
}
