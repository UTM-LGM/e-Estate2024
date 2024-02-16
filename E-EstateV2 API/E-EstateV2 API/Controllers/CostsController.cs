using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostsController : ControllerBase
    {
        private readonly ICostRepository _costRepository;

        public CostsController(ICostRepository costRepository)
        {
            _costRepository = costRepository;
        }

        [HttpGet]
        [Route("{costTypeId}")]
        public async Task<IActionResult> GetCostIndirects(int costTypeId)
        {
            var costIndirect = await _costRepository.GetCostIndirectByCostTypeId(costTypeId);   
            return Ok(costIndirect);
        }

        [HttpGet]
        public async Task<IActionResult> GetCostCategoryM()
        {
            var costCategoryM = await _costRepository.GetCostCategoryM();
            return Ok(costCategoryM);
        }

        [HttpGet]
        public async Task<IActionResult> GetCostSubCategoryM()
        {
            var costSubcategory1M = await _costRepository.GetCostSubCategoryM();
            return Ok(costSubcategory1M);
        }


        [HttpGet]
        public async Task<IActionResult> GetCostSubCategoryIM()
        {
            var costSubCategory2IM = await _costRepository.GetCostSubCategoryIM();
            return Ok(costSubCategory2IM);
        }
    }
}
