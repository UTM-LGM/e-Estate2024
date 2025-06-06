using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostCategoriesController : ControllerBase
    {
        private readonly IGenericRepository<CostCategory> _genericRepository;

        public CostCategoriesController(IGenericRepository<CostCategory> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddCostCategory([FromBody] CostCategory costCategory)
        {
            costCategory.createdDate = DateTime.Now;
            var addedCostCategory = await _genericRepository.Add(costCategory);
            return Ok(addedCostCategory);
        }

        [HttpGet]
        public async Task<IActionResult> GetCostCategories()
        {
            var costCategories = await _genericRepository.GetAll();
            return Ok(costCategories);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateCostCategory ([FromBody] CostCategory costCategory)
        {
            costCategory.updatedDate = DateTime.Now;
            var updatedCostCategory = await _genericRepository.Update(costCategory);
            return Ok(updatedCostCategory);
        }
    }
}
