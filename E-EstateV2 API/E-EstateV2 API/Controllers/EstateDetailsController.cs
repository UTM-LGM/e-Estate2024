using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]

    public class EstateDetailsController : ControllerBase
    {
        private readonly IEstateDetailRepository _estateRepository;

        public EstateDetailsController(IEstateDetailRepository estateDetailRepository)
        {
            _estateRepository = estateDetailRepository;
        }

        [HttpGet]
        [Route("{estateId:int}")]

        public async Task<IActionResult> GetEstateDetailbyEstateId(int estateId)
        {
            var estate = await _estateRepository.GetEstateDetailbyEstateId(estateId);
            return Ok(estate);
        }

        [HttpGet]
        public async Task<IActionResult> GetEstateDetails()
        {
            var estateDetails = await _estateRepository.GetEstateDetails();
            return Ok(estateDetails);
        }

        [HttpPost]
        public async Task<IActionResult> AddEstateDetail([FromBody] EstateDetail estate)
        {
            var addedEstate = await _estateRepository.AddEstateDetail(estate);
            return Ok(addedEstate);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateEstateDetail([FromBody] EstateDetail estate)
        {
            var updatedTown = await _estateRepository.UpdateEstateDetail(estate);
            return Ok(updatedTown);
        }
    }
}
