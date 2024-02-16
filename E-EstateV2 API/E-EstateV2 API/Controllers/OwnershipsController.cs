using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class OwnershipsController : ControllerBase
    {
        private readonly IGenericRepository<Ownership> _genericRepository;

        public OwnershipsController(IGenericRepository<Ownership> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetOwnership()
        {
            var ownership = await _genericRepository.GetAll();
            return Ok(ownership);
        }
        [HttpPost]
        public async Task<IActionResult> AddOwnership([FromBody] Ownership ownership)
        {
            ownership.createdDate = DateTime.Now;
            var addedOwnership = await _genericRepository.Add(ownership);
            return Ok(addedOwnership);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateOwnership([FromBody] Ownership ownership)
        {
            ownership.updatedDate = DateTime.Now;
            var updatedOwnership = await _genericRepository.Update(ownership);
            return Ok(updatedOwnership);
        }
    }
}
