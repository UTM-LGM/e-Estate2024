using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ProductComparisonsController : ControllerBase
    {
        private readonly IGenericRepository<ProductionComparison> _genericRepository;

        public ProductComparisonsController(IGenericRepository<ProductionComparison> genericRepository)
        {
               _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddProductionComparison([FromBody] ProductionComparison production)
        {
            production.createdDate = DateTime.Now;
            // production.createdYear = DateTime.Now.Year;
            production.createdYear = 2011;
            var addedProduction = await _genericRepository.Add(production);
            return Ok(addedProduction);
        }

        [HttpGet]
        public async Task<IActionResult> GetProductionComparisons()
        {
            var productionComparison = await _genericRepository.GetAll();
            return Ok(productionComparison);
        }
    }
}
