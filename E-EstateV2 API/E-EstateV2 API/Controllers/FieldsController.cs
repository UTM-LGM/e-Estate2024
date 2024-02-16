using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldsController : ControllerBase
    {
        private readonly IFieldRepository _fieldRepository;

        public FieldsController(IFieldRepository fieldRepository)
        {
            _fieldRepository = fieldRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddField([FromBody] Field field)
        {
            var addedField = await _fieldRepository.AddField(field);
            return Ok(addedField);
        }

        [HttpGet]
        public async Task<IActionResult> GetFields()
        {
            var fields = await _fieldRepository.GetFields();
            return Ok(fields);
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldDescStatus()
        {
            var fields = await _fieldRepository.GetFieldDescStatus();
            return Ok(fields);
        }


        //single data
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOneField([FromRoute] int id)
        {
            var oneField = await _fieldRepository.GetFieldById(id);
            return Ok(oneField);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateField([FromBody] Field field)
        {
           var updatedField = await _fieldRepository.UpdateField(field);
            return Ok(updatedField);
        }

        [HttpPost]
        public async Task<IActionResult> AddClone([FromBody] FieldClone clone)
        {
            var addedClone = await _fieldRepository.AddFieldClone(clone);
            return Ok(addedClone);
        }

        [HttpDelete]
        [Route("{cloneId:int}/{fieldId:int}")]
        public async Task<IActionResult> DeleteClone([FromRoute]int cloneId , int fieldId)
        {
            var existingClone = await _fieldRepository.GetFieldCloneById(cloneId, fieldId);
            if (existingClone != null)
            {
                await _fieldRepository.DeleteFieldClone(existingClone);
                return Ok(existingClone);
            }

            return NotFound();
        }

       
    }
}
