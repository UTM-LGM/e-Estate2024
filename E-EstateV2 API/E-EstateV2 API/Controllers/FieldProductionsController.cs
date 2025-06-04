using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldProductionsController : ControllerBase
    {
        private readonly IFieldProductionRepository _fieldProductionRepository;

        public FieldProductionsController(IFieldProductionRepository fieldProductionRepository)
        {
           _fieldProductionRepository = fieldProductionRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldProductions()
        {
            var fieldProductions = await _fieldProductionRepository.GetFieldProductions();
            return Ok(fieldProductions);
        }


        [HttpPost]
        public async Task<IActionResult> AddFieldProduction([FromBody] FieldProduction[] fieldProduction)
        {
            var addedFieldProduction = await _fieldProductionRepository.AddFieldProduction(fieldProduction);
            return Ok(addedFieldProduction);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProduction([FromBody] FieldProduction fieldProduction)
        {
            var updatedFieldProduction = await _fieldProductionRepository.UpdateFieldProduction(fieldProduction);
            return Ok(updatedFieldProduction);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProductionDraft([FromBody] FieldProduction[] fieldProductionDraft)
        {
            var updatedProduction = await _fieldProductionRepository.UpdateFieldProductionDraft(fieldProductionDraft);
            return Ok(updatedProduction);
        }
    }
}
