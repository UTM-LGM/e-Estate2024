using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostAmountsController : ControllerBase
    {
        private readonly ICostAmountRepository _costAmountRepository;

        public CostAmountsController(ICostAmountRepository costAmountRepository)
        {
            _costAmountRepository = costAmountRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddCostAmount([FromBody] CostAmount[] amount)
        {
            var addedCostAmount = await _costAmountRepository.AddCostAmount(amount);
            return Ok(addedCostAmount);
        }

        [HttpGet]
        public async Task<IActionResult> GetCostAmounts()
        {
            var costAmount = await _costAmountRepository.GetCostAmounts();
            return Ok(costAmount);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCostAmount([FromBody] CostAmount[] amount)
        {
            var updatedCostAmount = await _costAmountRepository.UpdateCostAmount(amount);
            return Ok(updatedCostAmount);
        } 
    }
}
