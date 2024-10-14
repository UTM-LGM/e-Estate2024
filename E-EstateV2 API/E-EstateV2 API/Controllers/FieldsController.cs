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
        private readonly string _wwwrootPath;

        public FieldsController(IFieldRepository fieldRepository, IFieldCloneRepository fieldCloneRepository, IFieldGrantRepository fieldGrantRepository,
            ApplicationDbContext applicationDbContext, IWebHostEnvironment webHostEnvironment)
        {
            _fieldRepository = fieldRepository;
            _fieldCloneRepository = fieldCloneRepository;
            _fieldGrantRepository = fieldGrantRepository;
            _applicationDbContext = applicationDbContext;
            _wwwrootPath = Path.Combine(webHostEnvironment.WebRootPath, "api/Files");
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

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOneFieldHistory([FromRoute] int id)
        {
            var oneField = await _fieldRepository.GetOneFieldHistory(id);
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
        public async Task<IActionResult> AddFieldWithDetails([FromBody] DTO_FieldWithDetails dto)
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
                    var fieldGrantsAdded =  await _fieldGrantRepository.AddFieldGrant(dto.FieldGrants);

                    await transaction.CommitAsync();

                    // Return fieldGrantId to be used for attachments
                    var fieldGrantIds = fieldGrantsAdded.Select(grant => grant.Id).ToArray();
                    return Ok(new { fieldGrantIds });
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw ex;
                }
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldAttachments([FromForm] IFormFile[] files, [FromForm] int fieldGrantId, [FromForm] string userId)
        {
            using (var transaction = await _applicationDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (files != null && files.Length > 0)
                    {
                        foreach (var file in files)
                        {
                            if (file.Length > 0)
                            {
                                Directory.CreateDirectory(_wwwrootPath);
                                var fileName = Path.GetFileName(file.FileName);
                                var filePath = Path.Combine(_wwwrootPath, fileName);

                                using (var stream = new FileStream(filePath, FileMode.Create))
                                {
                                    await file.CopyToAsync(stream);
                                }

                                var fieldGrantAttachment = new FieldGrantAttachment
                                {
                                    fileName = fileName,
                                    isActive = true,
                                    createdBy = userId,
                                    createdDate = DateTime.Now,
                                    fieldGrantId = fieldGrantId,
                                };

                                await _fieldGrantRepository.AddFieldGrantAttachment(fieldGrantAttachment);
                            }
                        }
                    }

                    await transaction.CommitAsync();
                    return Ok(true);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    throw ex;
                }
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateFieldAttachments([FromForm] IFormFile file, [FromForm] int fieldGrantId, [FromForm] string userId, [FromForm] int attachmentId, [FromForm] Boolean status)
        {
            using (var transaction = await _applicationDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    if (file != null && file.Length > 0)
                    {
                        // Fetch existing attachments for the given fieldGrantId
                        var existingAttachments = await _fieldGrantRepository.GetAttachmentsByFieldGrantId(fieldGrantId);

                        var fileName = Path.GetFileName(file.FileName);
                        var existingAttachment = existingAttachments.FirstOrDefault(a => a.Id == attachmentId);

                        if (existingAttachment != null)
                        {
                            // Replace the existing file
                            var existingFilePath = Path.Combine(_wwwrootPath, existingAttachment.fileName);
                            if (System.IO.File.Exists(existingFilePath))
                            {
                                System.IO.File.Delete(existingFilePath); // Delete old file
                            }

                            // Save the new file
                            var newFilePath = Path.Combine(_wwwrootPath, fileName);
                            using (var stream = new FileStream(newFilePath, FileMode.Create))
                            {
                                await file.CopyToAsync(stream);
                            }

                            var newFileName = Path.GetFileName(file.FileName);

                            // Update attachment details
                            existingAttachment.fileName = newFileName;
                            existingAttachment.isActive = status;
                            existingAttachment.updatedBy = userId;
                            existingAttachment.updatedDate = DateTime.Now;

                            await _fieldGrantRepository.UpdateFieldGrantAttachment(existingAttachment);
                        }
                        else
                        {
                            // Handle case where the attachment does not exist
                            return NotFound("Attachment not found.");
                        }
                    }

                    await transaction.CommitAsync();
                    return Ok(true);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    return StatusCode(500, $"Internal server error: {ex.Message}");
                }
            }
        }

        [HttpPut]
        public async Task<IActionResult> DeleteFieldAttachment([FromBody] int id)
        {
            var existingAttachment = _applicationDbContext.fieldGrantAttachments.Where(x=>x.Id == id).FirstOrDefault();
            if (existingAttachment != null)
            {
                existingAttachment.isActive = false;
                await _fieldGrantRepository.UpdateFieldGrantAttachment(existingAttachment);
            }
            return Ok(existingAttachment);
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
                    var updatedFieldGrant = await _fieldGrantRepository.UpdateFieldGrants(dto.Field.Id, dto.FieldGrants);

                    // Commit transaction if all operations succeed
                    await transaction.CommitAsync();

                    // Return success response to frontend
                    var fieldGrantIds = updatedFieldGrant.Select(grant => grant.Id).ToArray();
                    return Ok(new { fieldGrantIds });
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
