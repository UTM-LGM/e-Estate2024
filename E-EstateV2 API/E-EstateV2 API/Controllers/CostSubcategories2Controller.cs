using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostSubcategories2Controller : ControllerBase
    {
        private readonly IGenericRepository<CostSubcategory2> _genericRepository;

        public CostSubcategories2Controller(IGenericRepository<CostSubcategory2> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddSubCategory([FromBody] CostSubcategory2 costSubcategory2)
        {
            costSubcategory2.createdDate = DateTime.Now;
            var addedSubCategory = await _genericRepository.Add(costSubcategory2);
            return Ok(addedSubCategory);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubCategories()
        {
            var subCategories = await _genericRepository.GetAll();
            return Ok(subCategories);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCategory([FromBody] CostSubcategory2 costSubcategory2)
        {
            costSubcategory2.updatedDate = DateTime.Now;
            var updatedSubCategory = await _genericRepository.Update(costSubcategory2);
            return Ok(updatedSubCategory);
        }
    }
}
