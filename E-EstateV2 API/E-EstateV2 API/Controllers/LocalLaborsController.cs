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
    public class LocalLaborsController : ControllerBase
    {
        private readonly ILocalLaborRepository _localLaborRepository;

        public LocalLaborsController(ILocalLaborRepository localLaborRepository)
        {
            _localLaborRepository = localLaborRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddLabor([FromBody] LocalLabor[] labor)
        {
            var addedLocalLabor = await _localLaborRepository.AddLocalLabor(labor);
            return Ok(addedLocalLabor);
        }

        [HttpGet]
        public async Task<IActionResult> GetLocalLabors()
        {
            var localLabors = await _localLaborRepository.GetLocalLabors(); 
            return Ok(localLabors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLabor([FromBody] LocalLabor labor)
        {
            var updatedLocalLabor = await _localLaborRepository.UpdateLocalLabor(labor);    
            return Ok(updatedLocalLabor);
        }
    }
}
