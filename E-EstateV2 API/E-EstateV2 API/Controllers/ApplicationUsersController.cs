using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.Repository;
using E_EstateV2_API.ViewModel;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Diagnostics.Contracts;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApplicationUsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;

        public ApplicationUsersController(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        [HttpGet]
        [Route("{username}")]
        public async Task<IActionResult> GetUser(string username)
        {
            var user = await _userRepository.GetUserByUsername(username);
            return Ok(user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            var user = await _userRepository.GetAllUsers();
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Register(User user)
        {
            try
            {
                var registerUser = await _userRepository.RegisterUser(user);
                return Ok(registerUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser (User user)
        {
            var updatedUser = await _userRepository.UpdateUser(user);
            return Ok(updatedUser);
        }

        [HttpPost]
        public async Task<IActionResult> AddUser(User user)
        {
            try
            {
                var registerUser = await _userRepository.AddUser(user);
                return Ok(registerUser);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddUserRole(DTO_User user)
        {
            try
            {
                var userRole = await _userRepository.AddUserRole(user);
                return Ok(userRole);
            }
            catch (InvalidOperationException ex)
            {
                // Return 400 BadRequest with a custom error message
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Return 500 Internal Server Error with a custom error message
                return StatusCode(500, new { message = "An error occurred while adding the user role.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> SendWelcomeEmail([FromBody]  string email)
        {
            try
            {
                await _userRepository.SendWelcomeEmail(email);
                return Ok(new { message = "Welcome email have been sent to user" });
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to send email: " + ex.Message);
            }
        }

        [HttpPut]
        public async Task<IActionResult> DeactiveAccount([FromBody] DTO_User user)
        {
            var rejectAccount = await _userRepository.DeactiveAccount(user);
            return Ok(rejectAccount);
        }


        [HttpGet]
        [Route("{licenseNo}")]
        public async Task<IActionResult> CheckLicenseNo(string licenseNo)
        {
            try
            {
                var checkLicenseNo = await _userRepository.CheckLicenseNo(licenseNo);
                return Ok(checkLicenseNo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("{userId}/{oldPassword}")]
        public async Task<IActionResult> CheckOldPassword(string userId, string oldPassword)
        {
            try
            {
                var userPassword = await _userRepository.CheckOldPassword(userId, oldPassword);
                return Ok(userPassword);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("{username}")]
        public async Task<IActionResult> CheckUsername(string username)
        {
            try
            {
                var checkUsername = await _userRepository.CheckUsername(username);
                return Ok(new { username });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        public async Task<IActionResult> Login(Login login)
        {
            var token = await _userRepository.LoginUser(login);

            if (token != null)
            {
                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Username or Password is incorrect" });
            }
        }

        [HttpPost]
        public async Task<IActionResult> ChangePassword(DTO_User user)
        {
            try
            {
                await _userRepository.ChangePassword(user);
                return Ok(new { message = "Password reset successful !" });
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to reset password !");
            }
        }

    }
}
