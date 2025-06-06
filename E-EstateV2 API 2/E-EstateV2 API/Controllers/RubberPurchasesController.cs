using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RubberPurchasesController : ControllerBase
    {
        private readonly IRubberPurchaseRepository _rubberPurchaseRepository;

        public RubberPurchasesController(IRubberPurchaseRepository rubberPurchaseRepository)
        {
            _rubberPurchaseRepository = rubberPurchaseRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddPurchase([FromBody] RubberPurchase purchase)
        {
            var addedPurchase = await _rubberPurchaseRepository.AddPurchase(purchase);
            return Ok(addedPurchase);
        }

        [HttpGet]
        public async Task<IActionResult> GetRubberPurchases()
        {
            var purchases = await _rubberPurchaseRepository.GetRubberPurchases();
            return Ok(purchases);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateRubberPurchase([FromBody] RubberPurchase purchase)
        {
            var updatedPurchase = await _rubberPurchaseRepository.UpdateRubberPurchase(purchase);
            return Ok(updatedPurchase);
        }
    }
}
