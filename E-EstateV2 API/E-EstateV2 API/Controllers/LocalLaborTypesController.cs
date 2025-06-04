using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LocalLaborTypesController : ControllerBase
    {
        private readonly IGenericRepository<LaborType> _genericRepository;
        public LocalLaborTypesController(IGenericRepository<LaborType> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetLaborTypes()
        {
            var types = await _genericRepository.GetAll();
            return Ok(types);
        }


        [HttpPost]
        public async Task<IActionResult> AddLaborType([FromBody] LaborType type)
        {
            type.createdDate = DateTime.Now;
            var addedType = await _genericRepository.Add(type);
            return Ok(addedType);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateLaborType([FromBody] LaborType type)
        {
            type.updatedDate = DateTime.Now;
            var updatedType = await _genericRepository.Update(type);
            return Ok(updatedType);
        }
    }
}
