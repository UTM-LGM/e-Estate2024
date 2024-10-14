using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class WorkerShortagesController : ControllerBase
    {
        private readonly IGenericRepository<WorkerShortage> _genericRepository;

        public WorkerShortagesController(IGenericRepository<WorkerShortage> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddWorkerShortage([FromBody] WorkerShortage workerShortage)
        {
            workerShortage.createdDate = DateTime.Now;
            var addedWorkerShortage = await _genericRepository.Add(workerShortage);
            return Ok(addedWorkerShortage);
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkerShortage()
        {
            var workerShortage = await _genericRepository.GetAll();
            return Ok(workerShortage);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateWorkerShortage([FromBody] WorkerShortage workerShortage)
        {
            workerShortage.updatedDate = DateTime.Now;
            var updatedWorkerShortage = await _genericRepository.Update(workerShortage);
            return Ok(updatedWorkerShortage);

        }
    }
}
