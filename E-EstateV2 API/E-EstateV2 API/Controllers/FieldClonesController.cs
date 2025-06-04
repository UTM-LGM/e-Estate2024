using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldClonesController : ControllerBase
    {
        private readonly IFieldCloneRepository _fieldCloneRepository;

        public FieldClonesController(IFieldCloneRepository fieldCloneRepository)
        {
            _fieldCloneRepository = fieldCloneRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddClone([FromBody] FieldClone[] fieldClone)
        {
            var addedFieldClone = await _fieldCloneRepository.AddFieldClone(fieldClone); 
            return Ok(addedFieldClone);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldCloneStatus([FromBody] FieldClone fieldClone)
        {
            var updatedStatus = await _fieldCloneRepository.UpdateFieldCloneStatus(fieldClone.fieldId);
            return Ok(updatedStatus);
        }
    }
}
