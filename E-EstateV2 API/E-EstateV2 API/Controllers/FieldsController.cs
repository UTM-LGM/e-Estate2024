using E_EstateV2_API.Data;
using E_EstateV2_API.DTO;
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
        private readonly IFieldCloneRepository _fieldCloneRepository;
        private readonly IFieldGrantRepository _fieldGrantRepository;
        private readonly ApplicationDbContext _applicationDbContext;

        public FieldsController(IFieldRepository fieldRepository, IFieldCloneRepository fieldCloneRepository, IFieldGrantRepository fieldGrantRepository,
            ApplicationDbContext applicationDbContext)
        {
            _fieldRepository = fieldRepository;
            _fieldCloneRepository = fieldCloneRepository;
            _fieldGrantRepository = fieldGrantRepository;
            _applicationDbContext = applicationDbContext;

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
            var sortedField = fields.OrderByDescending(field => field.isActive).ToList();
            return Ok(sortedField);
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

        [HttpPut]
        public async Task<IActionResult> UpdateFieldInfected([FromBody] Field field)
        {
            var updatedField = await _fieldRepository.UpdateFieldInfected(field);
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
        public async Task<IActionResult> DeleteClone([FromRoute] int cloneId, int fieldId)
        {
            var existingClone = await _fieldRepository.GetFieldCloneById(cloneId, fieldId);
            if (existingClone != null)
            {
                await _fieldRepository.DeleteFieldClone(existingClone);
                return Ok(existingClone);
            }

            return NotFound();
        }

        [HttpPost]
        public async Task<bool> AddFieldWithDetails([FromBody] DTO_FieldWithDetails dto)
        {
            /**var addedField = await _fieldRepository.AddField(dto);
            return Ok(addedField);**/

            using (var transaction = await _applicationDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    await _fieldRepository.AddField(dto.Field);

                    foreach (var item in dto.FieldClones)
                    {
                        //navigation property
                        item.Field = dto.Field;
                    }
                    await _fieldCloneRepository.AddFieldClone(dto.FieldClones);

                    foreach (var item in dto.FieldGrants)
                    {
                        //navigation property
                        item.Field = dto.Field;
                    }
                    await _fieldGrantRepository.AddFieldGrant(dto.FieldGrants);

                    await transaction.CommitAsync();
                    return true;
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw ex;
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> UpdateFieldWithDetails([FromBody] DTO_FieldWithDetails dto)
        {
            /**var updatedField = await _fieldRepository.UpdateField(dto);
            return Ok(updatedField);**/

            using (var transaction = await _applicationDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    // Update the main Field entity
                    await _fieldRepository.UpdateField(dto.Field);

                    // Update or add FieldClones
                    await _fieldCloneRepository.UpdateFieldClones(dto.Field.Id, dto.FieldClones);

                    // Update or add FieldGrants
                    await _fieldGrantRepository.UpdateFieldGrants(dto.Field.Id, dto.FieldGrants);

                    // Commit transaction if all operations succeed
                    await transaction.CommitAsync();

                    // Return success response to frontend
                    return Ok(new { success = true, message = "Field details updated successfully." });
                }
                catch (Exception ex)
                {
                    // Rollback transaction on error
                    await transaction.RollbackAsync();
                    return StatusCode(500, new { success = false, message = "Error updating field details.", error = ex.Message });
                }
            }
        }

    }
}
