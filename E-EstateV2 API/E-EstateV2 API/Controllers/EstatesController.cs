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
    public class EstatesController : ControllerBase
    {
        private readonly IEstateRepository _estateRepository;

        public EstatesController(IEstateRepository estateRepository)
        {
            _estateRepository = estateRepository;
        }

        //Get All
        [HttpGet]
        public async Task<IActionResult> GetEstates()
        {        
            var estates = await _estateRepository.GetEstates();
            return Ok(estates);
        }

        //Get one estate
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOneEstate([FromRoute] int id)
        {
            var estate = await _estateRepository.GetEstateById(id);
            return Ok(estate);
        }

        [HttpPost]
        public async Task<IActionResult> AddEstate([FromBody] Estate estate)
        {
            var addedEstate = await _estateRepository.AddEstate(estate);
            return Ok(addedEstate);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstate([FromBody] Estate estate)
        {
            var updatedEstate = await _estateRepository.UpdateEstate(estate);
            return Ok(updatedEstate);
        }

        [HttpGet]
        [Route("{estateName}")]
        public async Task<IActionResult> CheckEstateName (string estateName)
        {
            try
            {
                var checkEstate = await _estateRepository.CheckEstateName(estateName);
                return Ok(new { estateName });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
