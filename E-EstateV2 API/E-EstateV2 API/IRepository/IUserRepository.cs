using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Identity;

namespace E_EstateV2_API.IRepository
{
    public interface IUserRepository
    {
        //To return DTO
        Task<DTO_User> GetUserByUsername(string username);
        //to return UserManager class involving identity-related tasks
        Task<IdentityResult> RegisterUser(User user);
        //To return string example, token
        Task<String> LoginUser(Login login);
        Task<object> CheckLicenseNo(string licenseNo);
        Task<object> CheckUsername(string username);
        Task<object> ChangePassword(DTO_User user);
        Task<object> CheckOldPassword(string userId, string oldPassword);
        Task<List<DTO_User>> GetAllUsers();
        Task<DTO_User> AddUserRole(DTO_User user);
        Task SendWelcomeEmail(string email);
        Task<IdentityResult> AddUser(User user);
        Task<ApplicationUser> UpdateUser(User user);

    }
}
