using E_EstateV2_API.IRepository;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;

        public RolesController(IRoleRepository roleRepository)
        {
            _roleRepository = roleRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleRepository.GetRoles();
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> AddRole([FromBody] string roleName)
        {
            var result = await _roleRepository.AddRole(roleName);
            return Ok(result);
        }
    }
}
