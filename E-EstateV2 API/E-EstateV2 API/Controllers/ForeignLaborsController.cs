using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ForeignLaborsController : ControllerBase
    {
        private readonly IForeignLaborRepository _foreignLaborRepository;

        public ForeignLaborsController(IForeignLaborRepository foreignLaborRepository)
        {
            _foreignLaborRepository = foreignLaborRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddLabor([FromBody] LaborInfo labor)
        {
            var addedForeignLabor = await _foreignLaborRepository.AddForeignLabor(labor);
            return Ok(addedForeignLabor);
        }

        [HttpGet]
        public async Task<IActionResult> GetLabors()
        {
           var foreignLabors = await _foreignLaborRepository.GetForeignLabors();
            return Ok(foreignLabors);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLabor([FromBody] LaborInfo labor)
        {
           var updatedForeignLabor = await _foreignLaborRepository.UpdateForeignLabor(labor);   
            return Ok(updatedForeignLabor);
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IActionResult> DeleteLabor([FromRoute] int id)
        {
            var deletedForeignLabor = await _foreignLaborRepository.DeleteForeignLabor(id);
            return Ok(deletedForeignLabor);
        }
    }
}
