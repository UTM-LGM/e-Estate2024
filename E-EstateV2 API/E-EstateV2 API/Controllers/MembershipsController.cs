using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MembershipsController : ControllerBase
    {
        private readonly IGenericRepository<MembershipType> _genericRepository;
        public MembershipsController(IGenericRepository<MembershipType> genericRepository)
        {
            _genericRepository = genericRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetMemberships()
        {
            var memberships = await _genericRepository.GetAll();
            return Ok(memberships);
        }

        [HttpPost]
        public async Task<IActionResult> AddMembership([FromBody] MembershipType membershipType)
        {
            membershipType.createdDate = DateTime.Now;
            var addedMembership = await _genericRepository.Add(membershipType);
            return Ok(addedMembership);

        }

        [HttpPut]
        public async Task<IActionResult> UpdateMembership([FromBody] MembershipType membershipType)
        {
            membershipType.updatedDate = DateTime.Now;
            var updatedMembership = await _genericRepository.Update(membershipType);
            return Ok(updatedMembership);
        }
    }
}
