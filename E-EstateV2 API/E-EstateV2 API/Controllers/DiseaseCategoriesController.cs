using E_EstateV2_API.IRepository;
using E_EstateV2_API.Migrations;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DiseaseCategoriesController : ControllerBase
    {
        private readonly IGenericRepository<DiseaseCategory> _genericRepository;
        public DiseaseCategoriesController(IGenericRepository<DiseaseCategory> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDiseaseCategory()
        {
            var diseaseCategory = await _genericRepository.GetAll();
            return Ok(diseaseCategory);
        }
    }
}
