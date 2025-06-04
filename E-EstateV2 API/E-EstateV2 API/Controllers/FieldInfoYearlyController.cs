using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FieldInfoYearlyController : ControllerBase
    {
        private readonly IFieldInfoYearlyRepository _fieldInfoYearlyRepository;
        public FieldInfoYearlyController(IFieldInfoYearlyRepository fieldInfoYearlyRepository)
        {
            _fieldInfoYearlyRepository = fieldInfoYearlyRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddFieldInfoYearly([FromBody] FieldInfoYearly[] fieldInfo)
        {
            var addedFieldInfo = await _fieldInfoYearlyRepository.AddFieldInfo(fieldInfo);
            return Ok(addedFieldInfo);
        }

        [HttpGet]
        [Route("{year:int}")]
        public async Task<IActionResult> GetFieldInfoYearly( int year)
        {
            var fieldInfoYearly = await _fieldInfoYearlyRepository.GetFieldInfo(year);
            return Ok(fieldInfoYearly);
        }
    }
}
