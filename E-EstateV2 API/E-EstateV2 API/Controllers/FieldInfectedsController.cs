using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldInfectedsController : ControllerBase
    {
        private readonly IFieldInfectedRepository _fieldInfectedRepository;

        public FieldInfectedsController(IFieldInfectedRepository fieldInfectedRepository)
        {
            _fieldInfectedRepository = fieldInfectedRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldInfected()
        {
            var fieldInfected = await _fieldInfectedRepository.GetAll();
            return Ok(fieldInfected);
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldInfected([FromBody] FieldInfected fieldInfected)
        {
            fieldInfected.createdDate = DateTime.Now;
            var addedFieldInfected = await _fieldInfectedRepository.Add(fieldInfected);
            return Ok(addedFieldInfected);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldInfected([FromBody] FieldInfected fieldInfected)
        {
            fieldInfected.updatedDate = DateTime.Now;
            var updatedFieldInfected = await _fieldInfectedRepository.Update(fieldInfected);
            return Ok(updatedFieldInfected);
        }

        [HttpGet]
        [Route("{estateId:int}")]
        public async Task<IActionResult> GetFieldInfectedByEstateId([FromRoute] int estateId)
        {
            var field = await _fieldInfectedRepository.GetFieldInfectedByEstateId(estateId);
            return Ok(field);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldInfectedRemark([FromBody] FieldInfected fieldInfected)
        {
            fieldInfected.updatedDate = DateTime.Now;
            var updateFieldInfected = await _fieldInfectedRepository.UpdateFieldInfectedRemark(fieldInfected);
            return Ok(updateFieldInfected);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetFieldInfectedById([FromRoute] int id)
        {
            var field = await _fieldInfectedRepository.GetFieldInfectedById(id);
            return Ok(field);
        }
    }
}
