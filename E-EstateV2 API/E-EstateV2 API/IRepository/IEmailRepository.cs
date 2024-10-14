using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Identity;

namespace E_EstateV2_API.IRepository
{
    public interface IEmailRepository
    {
        Task SendEmail(Email request);
        Task VerifyEmail(string encodedData);
        Task SendPasswordResetEmail(User user);
        Task<IdentityResult> ResetPassword(DTO_User user);
        Task VerifyEmailVerifiedUser(string encodedData);
    }
}
