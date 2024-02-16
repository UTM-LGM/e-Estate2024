using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        private readonly IGenericRepository<Seller> _genericRepository;

        public SellersController(IGenericRepository<Seller> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddSeller([FromBody] Seller seller)
        {
            seller.createdDate = DateTime.Now;
            var addedSeller = await _genericRepository.Add(seller);
            return Ok(addedSeller);
        }

        [HttpGet]
        public async Task<IActionResult> GetSellers()
        {
            var sellers = await _genericRepository.GetAll();
            return Ok(sellers);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSeller([FromBody] Seller seller)
        {
            seller.updatedDate= DateTime.Now;
            var updatedSeller = await _genericRepository.Update(seller);
            return Ok(updatedSeller);
        }
    }
}
