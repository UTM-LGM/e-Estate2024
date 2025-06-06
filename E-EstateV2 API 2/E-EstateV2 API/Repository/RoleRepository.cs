using E_EstateV2_API.IRepository;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace E_EstateV2_API.Repository
{
    public class RoleRepository:IRoleRepository
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleRepository(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<List<DTO_Role>> GetRoles()
        {
            var role = await _roleManager.Roles.Select(x => new DTO_Role
            {
                id = x.Id.ToString(),
                name = x.Name
            }).ToListAsync();
            return role;
        }
        public async Task<IdentityResult> AddRole(string roleName)
        {
            var role = new IdentityRole { Name = roleName };
            var result = await _roleManager.CreateAsync(role);
            return result;
        }
    }
}
