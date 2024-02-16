using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CostSubcategories1Controller : ControllerBase
    {
        private readonly IGenericRepository<CostSubcategory1> _genericRepository;

        public CostSubcategories1Controller(IGenericRepository<CostSubcategory1> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddSubCatategory([FromBody] CostSubcategory1 costSubcategory1)
        {
           costSubcategory1.createdDate = DateTime.Now;   
           var addedSubCategory = await _genericRepository.Add(costSubcategory1);
           return Ok(addedSubCategory);
        }

        [HttpGet]
        public async Task<IActionResult> GetSubCategories()
        {
            var subCategories = await _genericRepository.GetAll();
            return Ok(subCategories);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateSubCategory([FromBody] CostSubcategory1 costSubcategory1)
        {
            costSubcategory1.updatedDate = DateTime.Now;
            var updatedSubCategory = await _genericRepository.Update(costSubcategory1);
            return Ok(updatedSubCategory);
        }
    }
}
