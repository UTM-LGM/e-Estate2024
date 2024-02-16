using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StatesController : ControllerBase
    {
        private readonly IGenericRepository<State> _genericRepository;
        public StatesController(IGenericRepository<State> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        //get
        [HttpGet]
        public async Task<IActionResult> GetStates()
        {
            var states = await _genericRepository.GetAll();
            return Ok(states);
        }

        [HttpPost]
        public async Task<IActionResult> AddState([FromBody] State state)
        {
            state.createdDate = DateTime.Now;
            var addedState = await _genericRepository.Add(state);
            return Ok(addedState);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateState([FromBody] State state)
        {
            state.updatedDate = DateTime.Now;
            var updatedState = await _genericRepository.Update(state);
            return Ok(updatedState);
        }
    }
}
