using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OtherCropsController : ControllerBase
    {
        private readonly IGenericRepository<OtherCrop> _genericRepository;

        public OtherCropsController(IGenericRepository<OtherCrop> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetOtherCrop()
        {
            var otherCrops = await _genericRepository.GetAll();
            return Ok(otherCrops);
        }

        [HttpPost]
        public async Task<IActionResult> AddOtherCrop([FromBody] OtherCrop otherCrop)
        {
            otherCrop.createdDate = DateTime.Now;
            var addedOtherCrop = await _genericRepository.Add(otherCrop);
            return Ok(addedOtherCrop);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOtherCrop([FromBody] OtherCrop otherCrop )
        {
            otherCrop.updatedDate = DateTime.Now;
            var updatedOtherCrop = await _genericRepository.Update(otherCrop);  
            return Ok(updatedOtherCrop);
        }
    }
}
