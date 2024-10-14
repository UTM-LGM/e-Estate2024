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
    public class TownsController : ControllerBase
    {
        private readonly ITownRepository _townRepository;

        public TownsController(ITownRepository townRepository)
        {
            _townRepository = townRepository;
        }

        //Get all town
        [HttpGet]
        public async Task<IActionResult> GetTowns()
        {
            var towns = await _townRepository.GetTowns();
            return Ok(towns);
        }

        [HttpPost]
        public async Task<IActionResult> AddTown([FromBody] Town town)
        {
            var addedTown = await _townRepository.AddTown(town);
            return Ok(addedTown);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTown([FromBody] Town town)
        {
            var updatedTown = await _townRepository.UpdateTown(town);
            return Ok(updatedTown);
        }
    }
}
