using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TappingSystemsController : ControllerBase
    {
        private readonly IGenericRepository<TappingSystem> _genericRepository;
        public TappingSystemsController(IGenericRepository<TappingSystem> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetTappingSystem()
        {
            var tappingSystem = await _genericRepository.GetAll();
            return Ok(tappingSystem);
        }

        [HttpPost]
        public async Task<IActionResult> AddTappingSystem([FromBody] TappingSystem tappingSystem)
        {
            tappingSystem.createdDate = DateTime.Now;
            var addedTappingSystem = await _genericRepository.Add(tappingSystem);
            return Ok(addedTappingSystem);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTappingSystem([FromBody] TappingSystem tappingSystem)
        {
            tappingSystem.updatedDate = DateTime.Now;
            var updateTappingSystem = await _genericRepository.Update(tappingSystem);
            return Ok(updateTappingSystem);
        }
    }
}
