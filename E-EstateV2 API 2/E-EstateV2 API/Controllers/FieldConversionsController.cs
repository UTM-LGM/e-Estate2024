using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldConversionsController : ControllerBase
    {
        private readonly IFieldConversionRepository _fieldConversionRepository;

        public FieldConversionsController(IFieldConversionRepository fieldConversionRepository)
        {
           _fieldConversionRepository = fieldConversionRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddConversion([FromBody] FieldConversion fieldConversion)
        {
            var addedFieldConversion = await _fieldConversionRepository.AddFieldClone(fieldConversion);
            return Ok(addedFieldConversion);
        }

        [HttpGet]
        public async Task<IActionResult> GetConversions()
        {
           var fieldConversions = await _fieldConversionRepository.GetFieldClones();
            return Ok(fieldConversions);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateConversion([FromBody] FieldConversion fieldConversion)
        {
            var updatedFieldConversion = await _fieldConversionRepository.UpdateFieldCLone(fieldConversion);
            return Ok(updatedFieldConversion);
        }

    }
}
