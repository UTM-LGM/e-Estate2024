using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CropTypesController : ControllerBase
    {
        private readonly IGenericRepository<CropType> _genericRepository;

        public CropTypesController(IGenericRepository<CropType> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCropTypes()
        {
            var cropTypes = await _genericRepository.GetAll(); 
            return Ok(cropTypes);
        }

        [HttpPost]
        public async Task<IActionResult> AddCropType ([FromBody] CropType cropType )
        {
            cropType.createdDate = DateTime.Now;
            var addedCropType = await _genericRepository.Add(cropType);
            return Ok(addedCropType);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateCropType([FromBody] CropType cropType)
        {
            cropType.updatedDate = DateTime.Now;
            var updatedCropType = await _genericRepository.Update(cropType);
            return Ok(updatedCropType);
        }
    }
}
