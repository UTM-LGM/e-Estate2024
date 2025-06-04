using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class EstablishmentsController : ControllerBase
    {
        private readonly IGenericRepository<Establishment> _genericRepository;

        public EstablishmentsController(IGenericRepository<Establishment> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetEstablishments()
        {
            var establishments = await _genericRepository.GetAll();
            return Ok(establishments);
        }

        [HttpPost]
        public async Task<IActionResult> AddEstablishment([FromBody] Establishment establishment)
        {
            establishment.createdDate = DateTime.Now;
            var addedEstablishment = await _genericRepository.Add(establishment);
            return Ok(addedEstablishment);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateEstablishment([FromBody] Establishment establishment)
        {
            establishment.updatedDate = DateTime.Now;
            var updatedEstablishment = await _genericRepository.Update(establishment);    
            return Ok(updatedEstablishment);
        }
    }
}
