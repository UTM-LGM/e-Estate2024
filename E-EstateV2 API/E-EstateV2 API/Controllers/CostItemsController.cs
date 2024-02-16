using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostItemsController : ControllerBase
    {
        private readonly ICostRepository _costRepository;

        public CostItemsController(ICostRepository costRepository)
        {
            _costRepository = costRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCostItems()
        {
            var costItems = await _costRepository.GetCostItems();
            return Ok(costItems);
        }

        [HttpPost]
        public async Task<IActionResult> AddCostItem([FromBody] Cost cost)
        {
            var addedCostItem = await _costRepository.AddCostItem(cost);
            return Ok(addedCostItem);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateCostItem([FromBody] Cost cost)
        {
            var updatedCostItem = await _costRepository.UpdateCostItems(cost);
            return Ok(updatedCostItem);
        }
    }
}
