using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldAttachmentsController : ControllerBase
    {
        private readonly IGenericRepository<FieldGrantAttachment> _repository;

        public FieldAttachmentsController(IGenericRepository<FieldGrantAttachment> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetFieldAttachment()
        {
            var attachments = await _repository.GetAll();
            return Ok(attachments);
        }

    }
}
