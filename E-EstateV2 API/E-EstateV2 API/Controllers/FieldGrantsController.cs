using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldGrantsController : ControllerBase
    {
        private readonly IFieldGrantRepository _fieldGrantRepository;

        public FieldGrantsController(IFieldGrantRepository fieldGrantRepository)
        {
            _fieldGrantRepository = fieldGrantRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldGrant([FromBody] FieldGrant[] fieldGrants)
        {
            var addedFieldGrant = await _fieldGrantRepository.AddFieldGrant(fieldGrants);
            return Ok(addedFieldGrant);
        }

        [HttpPost]
        public async Task<IActionResult> AddGrant([FromBody] FieldGrant grant)
        {
            var addedGrant = await _fieldGrantRepository.AddGrant(grant);
            return Ok(addedGrant);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldGrant([FromBody] FieldGrant fieldGrants)
        {
            var updatedStatus = await _fieldGrantRepository.UpdateFieldGrant(fieldGrants.fieldId);
            return Ok(updatedStatus);
        }

        [HttpGet]
        [Route("{fieldId:int}")]
        public async Task<IActionResult> GetFieldGrantByFieldId(int fieldId)
        {
            var fieldGrant = await _fieldGrantRepository.GetFieldGrantByFieldId(fieldId);
            return Ok(fieldGrant);
        }

        [HttpDelete]
        [Route("{grantId:int}")]
        public async Task<IActionResult> DeleteGrant([FromRoute] int grantId)
        {
            var existingGrant = await _fieldGrantRepository.GetFieldGrantById(grantId);
            if( existingGrant != null)
            {
                await _fieldGrantRepository.DeleteFieldGrant(existingGrant);
                return Ok(existingGrant);
            }
            return NotFound();
        }
    }
}
