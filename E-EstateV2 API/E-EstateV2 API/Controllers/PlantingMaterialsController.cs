using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PlantingMaterialsController : ControllerBase
    {
        private readonly IGenericRepository<PlantingMaterial> _genericRepository;

        public PlantingMaterialsController(IGenericRepository<PlantingMaterial> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetPlantingMaterial()
        {
            var plantingMaterial = await _genericRepository.GetAll();
            return Ok(plantingMaterial);
        }

        [HttpPost]
        public async Task<IActionResult> AddPlantingMaterial([FromBody] PlantingMaterial plantingMaterial)
        {
            plantingMaterial.createdDate = DateTime.Now;
            var addedPlantingMaterial = await _genericRepository.Add(plantingMaterial);
            return Ok(addedPlantingMaterial);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePlantingMaterial([FromBody] PlantingMaterial plantingMaterial)
        {
            plantingMaterial.updatedDate = DateTime.Now;
            var updatedPlantingMaterial = await _genericRepository.Update(plantingMaterial);
            return Ok(updatedPlantingMaterial);
        }

    }
}
