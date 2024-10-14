using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Identity;

namespace E_EstateV2_API.IRepository
{
    public interface IRoleRepository
    {
        Task<List<DTO_Role>> GetRoles();
        Task<IdentityResult> AddRole(string roleName);
    }
}
