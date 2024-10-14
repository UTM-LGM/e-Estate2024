using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OtherFieldsController : ControllerBase
    {
        private readonly IOtherFieldRepository _fieldRepository;

        public OtherFieldsController(IOtherFieldRepository otherFieldRepository)
        {
            _fieldRepository = otherFieldRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetOtherFields()
        {
            var otherFields = await _fieldRepository.GetOtherFields();
            return Ok(otherFields);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOneOtherField([FromRoute] int id)
        {
            var oneOtherField = await _fieldRepository.GetOtherFieldById(id);
            return Ok(oneOtherField);
        }

        [HttpPost]
        public async Task<IActionResult> AddOtherField([FromBody] OtherField otherField)
        {
            var addedOtherField = await _fieldRepository.AddOtherField(otherField);
            return Ok(addedOtherField);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOtherField([FromBody] OtherField otherField)
        {
            var updatedOtherField = await _fieldRepository.UpdateOtherField(otherField);
            return Ok(updatedOtherField);
        }

        [HttpGet]
        [Route("{fieldName}")]
        public async Task<IActionResult> CheckFieldName(string fieldName)
        {
            try
            {
                var otherFieldName = await _fieldRepository.CheckOtherFieldName(fieldName);
                return Ok(otherFieldName);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
    }
}
