using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LaborInformationsController : ControllerBase
    {
        private readonly ILaborInformationRepository _informationRepository;
        private readonly ILaborByCategoryRepository _byCategoryRepository;

        public LaborInformationsController(ILaborInformationRepository laborInformationRepository, ILaborByCategoryRepository laborByCategoryRepository)
        {
            _informationRepository = laborInformationRepository;
            _byCategoryRepository = laborByCategoryRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddLaborInfo([FromBody] LaborInfo laborInfo)
        {
            var addedLaborInfo = await _informationRepository.AddLaborInfo(laborInfo);
            return Ok(addedLaborInfo);
        }

        [HttpPost]
        public async Task<IActionResult> AddLaborByCategory([FromBody] LaborByCategory[] laborByCategory)
        {
            var addedLabor = await _byCategoryRepository.AddLaborByCategory(laborByCategory);
            return Ok(addedLabor);
        }

        [HttpGet]
        public async Task<IActionResult> GetLabors()
        {
            var foreignLabors = await _informationRepository.GetLaborInfo();
            return Ok(foreignLabors);
        }

        [HttpGet]
        public async Task<IActionResult> GetLaborCategory()
        {
            var labor = await _byCategoryRepository.GetLaborByCategories();
            return Ok(labor);
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetLaborCategoryByLaborInfoId(int id)
        {
            var labor = await _byCategoryRepository.GetLaborByCategoriesByLaborInfoId(id);
            return Ok(labor);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLaborInfo(LaborInfo laborInfo)
        {
            var updatedLabor = await _informationRepository.UpdateLaborInfo(laborInfo);
            return Ok(updatedLabor);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLaborCategory(LaborByCategory[] laborByCategory)
        {
            var updatedLabor = await _byCategoryRepository.UpdateLaborCategory(laborByCategory);
            return Ok(updatedLabor);
        }

        [HttpDelete]
        [Route("{laborInfoId:int}")]
        public async Task<IActionResult> DeleteLabor([FromRoute] int laborInfoId)
        {
            var deletedLabor = await _informationRepository.DeleteLaborInfo(laborInfoId);
            var deletedLaborCategory = await _byCategoryRepository.DeleteLaborCategory(laborInfoId);
            return Ok(deletedLaborCategory);
        }
    }
}
