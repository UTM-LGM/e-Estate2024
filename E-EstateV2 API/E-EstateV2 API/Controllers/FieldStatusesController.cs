using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldStatusesController : ControllerBase
    {
        private readonly IGenericRepository<FieldStatus> _genericRepository;

        public FieldStatusesController(IGenericRepository<FieldStatus> genericRepository)
        {
           _genericRepository = genericRepository;
        }

        //get
        [HttpGet]
        public async Task<IActionResult> GetFieldStatuses()
        {
            var fieldStatuses = await _genericRepository.GetAll(); 
            return Ok(fieldStatuses);
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldStatus([FromBody] FieldStatus fieldStatus)
        {
            fieldStatus.createdDate = DateTime.Now;
            var addedFieldStatus = await _genericRepository.Add(fieldStatus);
            return Ok(addedFieldStatus);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateFieldStatus([FromBody] FieldStatus fieldStatus)
        {
            fieldStatus.updatedDate = DateTime.Now;
            var updatedFieldStatus = await _genericRepository.Update(fieldStatus);
            return Ok(updatedFieldStatus);
        }
    }
}
