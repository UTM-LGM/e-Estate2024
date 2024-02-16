using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldDiseasesController : ControllerBase
    {
        private readonly IGenericRepository<FieldDisease> _genericRepository;
        public FieldDiseasesController(IGenericRepository<FieldDisease> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldDisease()
        {
            var fieldDisease = await _genericRepository.GetAll();
            return Ok(fieldDisease);
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldDisease([FromBody] FieldDisease fieldDisease)
        {
            fieldDisease.createdDate = DateTime.Now;
            var addedFieldDisease = await _genericRepository.Add(fieldDisease);
            return Ok(addedFieldDisease);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldDisease([FromBody] FieldDisease fieldDisease)
        {
            fieldDisease.updatedDate = DateTime.Now;
            var updateFieldDisease = await _genericRepository.Update(fieldDisease); 
            return Ok(updateFieldDisease);
        }
    }
}
