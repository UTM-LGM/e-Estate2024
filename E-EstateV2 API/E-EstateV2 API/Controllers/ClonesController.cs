using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ClonesController : ControllerBase
    {
        private readonly IGenericRepository<Clone> _genericRepository;

        public ClonesController(IGenericRepository<Clone> genericRepository)
        {
            _genericRepository = genericRepository;
        }


        [HttpGet]
        public async Task<IActionResult> GetClones()
        {
            var clones = await _genericRepository.GetAll();
            var sortedClones = clones.OrderBy(clone => clone.cloneName).ToList();
            return Ok(sortedClones);
        }

        [HttpPost]
        public async Task<IActionResult> AddClone([FromBody] Clone clone)
        {
            clone.createdDate = DateTime.Now;
            var addedClone = await _genericRepository.Add(clone);
            return Ok(addedClone);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateClone ([FromBody] Clone clone)
        {
            clone.updatedDate = DateTime.Now;
            var updatedClone = await _genericRepository.Update(clone);
            return Ok(updatedClone);
        }
    }
}
