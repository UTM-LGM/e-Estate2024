using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostTypesController : ControllerBase
    {
        private readonly IGenericRepository<CostType> _genericRepository;

        public CostTypesController(IGenericRepository<CostType> genericRepository)
        {
            _genericRepository= genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCostTypes()
        {
            var costTypes = await _genericRepository.GetAll();
            return Ok(costTypes);
        }

        [HttpPost]
        public async Task<IActionResult> AddCostType([FromBody] CostType costType)
        {
            costType.createdDate = DateTime.Now;
            var addedCostType = await _genericRepository.Add(costType);
            return Ok(addedCostType);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCostType([FromBody] CostType costType)
        {
            costType.updatedDate = DateTime.Now;
            var updatedCostType = await _genericRepository.Update(costType);
            return Ok(updatedCostType);
        }
    }
}
