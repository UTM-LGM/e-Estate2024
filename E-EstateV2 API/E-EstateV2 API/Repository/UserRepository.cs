using E_EstateV2_API.Data;
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using E_EstateV2_API.ViewModel;
using MailKit.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MimeKit.Text;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using static Org.BouncyCastle.Math.EC.ECCurve;
using MailKit.Net.Smtp;
using System.ComponentModel.Design;
using System.Numerics;


namespace E_EstateV2_API.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly UserManager<ApplicationUser> _usermanager;
        private readonly ApplicationDbContext _context;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _config;


        public UserRepository(IConfiguration config, UserManager<ApplicationUser> userManager, ApplicationDbContext context, RoleManager<IdentityRole> roleManager)
        {
            _usermanager = userManager;
            _context = context;
            _roleManager = roleManager;
            _config = config;

        }

        public async Task<DTO_User> GetUserByUsername(string username)
        {
            var user = await _usermanager.FindByNameAsync(username);

            if (user != null)
            {
                var claims = await _usermanager.GetClaimsAsync(user);
                var companyIdClaim = claims.FirstOrDefault(c => c.Type == "CompanyId");
                var estateIdClaim = claims.FirstOrDefault(c => c.Type == "EstateId");

                var result = new DTO_User
                {
                    id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    //from claim
                    CompanyId = companyIdClaim?.Value,
                    EstateId = estateIdClaim?.Value,
                    FullName = user.fullName,
                    Position = user.position,
                };

                return result;
            }
            else
            {
                return null;
            }
        }

        public async Task<List<DTO_User>> GetAllUsers()
        {
            var users = await _usermanager.Users.ToListAsync(); // Materialize the query

            var usersWithRoles = new List<DTO_User>();

            foreach (var user in users)
            {
                var roles = await _usermanager.GetRolesAsync(user);

                var userClaims = await _usermanager.GetClaimsAsync(user);
                var companyIdClaim = userClaims.FirstOrDefault(c => c.Type == "CompanyId");
                var estateIdClaim = userClaims.FirstOrDefault(c => c.Type == "EstateId");

                // Check if claims exist, otherwise set IDs to 0
                int companyId = companyIdClaim != null ? int.Parse(companyIdClaim.Value) : 0;
                int estateId = estateIdClaim != null ? int.Parse(estateIdClaim.Value) : 0;

                // Get companyName and estateName from _context.companies and _context.estates respectively
                var companyName = companyId != 0 ? await _context.companies
                    .Where(c => c.Id == companyId)
                    .Select(c => c.companyName)
                    .FirstOrDefaultAsync() : null;

                var companyPhoneNo = companyId != 0 ? await _context.companies
                   .Where(c => c.Id == companyId)
                   .Select(c => c.phone)
                   .FirstOrDefaultAsync() : null;

                var estateName = estateId != 0 ? await _context.estates
                    .Where(e => e.Id == estateId)
                    .Select(e => e.estateName)
                    .FirstOrDefaultAsync() : null;

                var dtoUser = new DTO_User
                {
                    id = user.Id,
                    FullName = user.fullName,
                    UserName = user.UserName,
                    Email = user.Email,
                    Position = user.position,
                    isEmailVerified = user.isEmailVerified,
                    RoleName = roles.FirstOrDefault(),
                    RoleId = _context.Roles.Where(r => r.Name == roles.FirstOrDefault()).Select(r => r.Id).FirstOrDefault(),
                    CompanyId = companyIdClaim != null ? companyIdClaim.Value : "0",
                    EstateId = estateIdClaim != null ? estateIdClaim.Value : "0",
                    CompanyName = companyName,
                    EstateName = estateName,
                    CompanyPhoneNo = companyPhoneNo,
                    licenseNo = user.licenseNo,
                    isActive = user.isActive,
                };

                usersWithRoles.Add(dtoUser);
            }
            return usersWithRoles;
        }

        public async Task<ApplicationUser>UpdateUser (User user)
        {
            var existingUser = await _usermanager.FindByIdAsync(user.Id);
            if (existingUser != null)
            {
                // Check if the licenseNo has changed
                bool licenseNoChanged = existingUser.licenseNo != user.licenseNo;

                existingUser.fullName = user.fullName;
                existingUser.licenseNo = user.licenseNo;
                existingUser.position = user.position;
                existingUser.UserName = user.userName;
                existingUser.Email = user.email;
                await _usermanager.UpdateAsync(existingUser);

                if (licenseNoChanged)
                {
                    // Remove existing claims
                    var claims = await _usermanager.GetClaimsAsync(existingUser);
                    foreach (var claim in claims)
                    {
                        if (claim.Type == "CompanyId" || claim.Type == "EstateId")
                        {
                            await _usermanager.RemoveClaimAsync(existingUser, claim);
                        }
                    }

                    // Add updated claims
                    await _usermanager.AddClaimAsync(existingUser, new Claim("CompanyId", user.companyId.ToString()));
                    await _usermanager.AddClaimAsync(existingUser, new Claim("EstateId", user.estateId.ToString()));
                }
                return existingUser;
            }
            return null;
        }


        public async Task<IdentityResult> RegisterUser(User user)
        {
            var estateId = user.estateId;
            var companyId = user.companyId;

            var applicationUser = new ApplicationUser()
            {
                UserName = user.userName,
                Email = user.email,
                fullName = user.fullName,
                licenseNo = user.licenseNo,
                position = user.position,
            };

            var newUser = new User()
            {
                companyId = companyId,
                estateId = estateId,
            };

            var result = await _usermanager.CreateAsync(applicationUser, user.password);
            //add AspNetUserClaim Table
            await _usermanager.AddClaimAsync(applicationUser, new Claim("CompanyId", newUser.companyId.ToString()));
            await _usermanager.AddClaimAsync(applicationUser, new Claim("EstateId", newUser.estateId.ToString()));

            //Insert role in register
            if (result.Succeeded)
            {
                return result;
            }
            return result;
        }


        public async Task<IdentityResult> AddUser(User user)
        {
            var applicationUser = new ApplicationUser()
            {
                UserName = user.userName,
                fullName = user.fullName,
                Email = user.email,
                position = user.position,
                isEmailVerified = true
            };
            var result = await _usermanager.CreateAsync(applicationUser, user.password);
            if(result.Succeeded)
            {
                var userId = applicationUser.Id;
                var roleId = user.roleId.ToString();

                var userRole = new IdentityUserRole<string>()
                {
                    UserId = userId,
                    RoleId = roleId
                };

                //substitute code for AddToRoleAsync()
                _context.Set<IdentityUserRole<string>>().Add(userRole);
                _context.SaveChanges();
            }
            return result;
        }


        public async Task<String> LoginUser(Login login)
        {
            var user = await _usermanager.FindByNameAsync(login.username);

            if (user != null && await _usermanager.CheckPasswordAsync(user, login.password) && user.isEmailVerified == true && user.isActive == true)
            {
                var role = await _usermanager.GetRolesAsync(user);

                if(role.FirstOrDefault() != "Admin")
                {
                    var estateIDClaim = (await _usermanager.GetClaimsAsync(user)).Where(x => x.Type == "EstateId").FirstOrDefault();
                    string estateID = estateIDClaim.Value;

                    var companyIDClaim = (await _usermanager.GetClaimsAsync(user)).Where(x => x.Type == "CompanyId").FirstOrDefault();
                    string companyID = companyIDClaim.Value;

                    // Generate keyBytesx
                    byte[] keyBytes = new byte[32];
                    using (var rng = new RNGCryptoServiceProvider())
                    {
                        rng.GetBytes(keyBytes);
                    }

                    IdentityOptions _options = new();
                    var tokenDesc = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                        new Claim("userName", user.UserName.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault()),
                        new Claim("estateId", estateID),
                        new Claim ("companyId", companyID)
                        }),
                        Expires = DateTime.UtcNow.AddHours(2),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDesc);
                    var token = tokenHandler.WriteToken(securityToken);
                    return token;
                }

                else
                {
                    // Generate keyBytesx
                    byte[] keyBytes = new byte[32];
                    using (var rng = new RNGCryptoServiceProvider())
                    {
                        rng.GetBytes(keyBytes);
                    }

                    IdentityOptions _options = new();
                    var tokenDesc = new SecurityTokenDescriptor
                    {
                        Subject = new ClaimsIdentity(new Claim[]
                        {
                        new Claim("userName", user.UserName.ToString()),
                        new Claim(_options.ClaimsIdentity.RoleClaimType, role.FirstOrDefault()),
                        }),
                        Expires = DateTime.UtcNow.AddDays(1),
                        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
                    };
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var securityToken = tokenHandler.CreateToken(tokenDesc);
                    var token = tokenHandler.WriteToken(securityToken);
                    return token;
                }

                
            }
            else
            {
                return null;
            }
        }

        public Task<object> CheckLicenseNo(string licenseNo)
        {
            var estateId = _context.estates.Where(x => x.licenseNo == licenseNo).Select(x => x.Id).FirstOrDefault();
            var companyId = _context.estates.Where(x => x.Id == estateId).Select(x => x.companyId).FirstOrDefault();

            if (estateId == 0 && companyId == 0)
            {
                throw new("License No does not exist");
            }
            else
            {
                var result = new
                {
                    estateName = _context.estates.Where(x => x.Id == estateId).Select(x => x.estateName).FirstOrDefault(),
                    companyName = _context.companies.Where(x => x.Id == companyId).Select(x => x.companyName).FirstOrDefault(),
                };
                return Task.FromResult<object>(result);
            }
        }

        public async Task<object> CheckUsername(string username)
        {
            var user = await _usermanager.FindByNameAsync(username);
            if (user == null)
            {
                return username;
            }
            else
            {
                throw new("Username already taken");
            }
        }

        public async Task<object> ChangePassword(DTO_User user)
        {
            var applicationUser = await _usermanager.FindByIdAsync(user.id);
            if (applicationUser == null)
            {
                throw new ApplicationException($"Unable to load user with ID '{user.id}'.");
            }

            // Check if the old password matches before changing
            bool isOldPasswordCorrect = await CheckOldPassword(user.id, user.OldPassword.ToLower());
            if (!isOldPasswordCorrect)
            {
                throw new ApplicationException("Old password is incorrect.");
            }

            // Change the password
            var result = await _usermanager.ChangePasswordAsync(applicationUser, user.OldPassword.ToLower(), user.NewPassword.ToLower());

            if (result.Succeeded)
            {
                return result;
            }
            else
            {
                // Handle password change failure
                throw new ApplicationException($"Failed to change password: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }
        }


        public async Task<bool> CheckOldPassword(string userId, string oldPassword)
        {
            var userExist = await _usermanager.FindByIdAsync(userId);
            if (userExist != null)
            {
                var result = await _usermanager.CheckPasswordAsync(userExist, oldPassword);
                if (result)
                {
                    return result; // This should return true if password matches, false if not
                }
                throw new ApplicationException("Old password is wrong");

            }
            throw new ApplicationException("User does not exist");
        }


        public async Task<DTO_User> AddUserRole(DTO_User user)
        {
            // Find the existing user by userId
            var existingUser = await _usermanager.FindByIdAsync(user.id);

            // Get the license number of the user
            var licenseNumber = user.licenseNo;  // Assuming `licenseNo` is part of the DTO_User

            // Get role IDs for "CompanyAdmin" and "EstateClerk"
            var companyAdminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "CompanyAdmin");
            var estateClerkRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "EstateClerk");

            if (companyAdminRole == null || estateClerkRole == null)
            {
                throw new InvalidOperationException("Roles not found in the database.");
            }

            var role = await _context.Roles
            .FirstOrDefaultAsync(r => r.Id == user.RoleId);
            user.RoleName = role.Name;

            // Query to get users with the same licenseNo and their roles
            var usersWithSameLicenseRoles = await _context.Users
                .OfType<ApplicationUser>()
                .Where(u => u.licenseNo == licenseNumber && u.isActive == true)
                .Join(_context.UserRoles,
                    u => u.Id,
                    ur => ur.UserId,
                    (u, ur) => new { u, ur.RoleId })
                .ToListAsync();

            // Check if the user is trying to add the "CompanyAdmin" role
            if (user.RoleName == "CompanyAdmin")
            {
                var companyAdminCount = usersWithSameLicenseRoles.Count(ur =>
                    ur.RoleId == companyAdminRole.Id);

                if (companyAdminCount >= 1)
                {
                    throw new InvalidOperationException("This license already has a Company Admin.");
                }
            }

            // Check if the user is trying to add the "EstateClerk" role
            if (user.RoleName == "EstateClerk")
            {
                var estateClerkCount = usersWithSameLicenseRoles.Count(ur =>
                    ur.RoleId == estateClerkRole.Id);

                if (estateClerkCount >= 2)
                {
                    throw new InvalidOperationException("This license already has the maximum number of Estate Clerks.");
                }
            }

            // Add or update user roles as needed
            if (existingUser == null)
            {
                // User does not exist, create a new user
                var newUser = new ApplicationUser
                {
                    Id = user.id,
                    licenseNo = licenseNumber,
                    fullName = user.FullName,
                    isEmailVerified = user.isEmailVerified,
                    position = user.Position
                };
                _context.Users.Add(newUser);

                var userRole = new IdentityUserRole<string>()
                {
                    UserId = user.id,
                    RoleId = user.RoleId  // Assign the role GUID
                };

                _context.Set<IdentityUserRole<string>>().Add(userRole);
                await _context.SaveChangesAsync();


                return user;
            }
            else
            {
                // User exists, find and remove the existing user role
                var existingUserRole = await _context.UserRoles
                    .FirstOrDefaultAsync(ur => ur.UserId == user.id);

                if (existingUserRole != null)
                {
                    _context.Set<IdentityUserRole<string>>().Remove(existingUserRole);
                    await _context.SaveChangesAsync();
                }

                // Add the new user role
                var userRole = new IdentityUserRole<string>()
                {
                    UserId = user.id,
                    RoleId = user.RoleId  // Assign the role GUID
                };

                _context.Set<IdentityUserRole<string>>().Add(userRole);
                await _context.SaveChangesAsync();

                await SendWelcomeEmail(user.Email);

                return user;
            }
        }


        public async Task SendWelcomeEmail(string email)
        {
            var mimeEmail = new MimeMessage();
            mimeEmail.From.Add(MailboxAddress.Parse("RRIMestet@lgm.gov.my"));
            //User email
            mimeEmail.To.Add(MailboxAddress.Parse(email));
            mimeEmail.Subject = "Welcome to RRIMestet system";
            string htmlMessage = GenerateHtmlWelcomeUser();
            mimeEmail.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };
            using (var client = new SmtpClient())
            {
                client.LocalDomain = "lgm.gov.my";
                await client.ConnectAsync(_config.GetSection("EmailHost").Value, 25, SecureSocketOptions.None).ConfigureAwait(false);
                await client.SendAsync(mimeEmail).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }

        private string GenerateHtmlWelcomeUser()
        {
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/>" +
                "<br>" +
                "Thank you for registering with RRIMestet. " +
                "Your account have been verified ! " +
                //"Please click <a href = 'https://www5.lgm.gov.my/RRIMestet" + "'>Login RRIMestet</a><br>" +
                //"Please click <a href = 'https://lgm20.lgm.gov.my/RRIMestet" + "'>Login RRIMestet</a><br>" +
                "Please click <a href = 'https://www5.lgm.gov.my/trainingE-estate" + "'>Login RRIMestet</a><br>" +
                "<br>" +
                "Thank you," +
                "<br>" +
                "RRIMestet Admin" +
                "<br><br>" +
                "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }
 
        public async Task<ApplicationUser> DeactiveAccount(DTO_User user)
        {
            var existingUser = await _usermanager.FindByIdAsync(user.id);
            if (existingUser != null)
            {
                existingUser.isActive = false;
                await _usermanager.UpdateAsync(existingUser);
                await SendRejectAccount(user.Email);
            }
            return existingUser;
        }

        public async Task SendRejectAccount(string email)
        {
            var mimeEmail = new MimeMessage();
            mimeEmail.From.Add(MailboxAddress.Parse("RRIMestet@lgm.gov.my"));
            //User email
            mimeEmail.To.Add(MailboxAddress.Parse(email));
            mimeEmail.Subject = "LGM Admin RRIMestet deactive user account";
            string htmlMessage = GenerateHtmlRejectUser();
            mimeEmail.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };
            using (var client = new SmtpClient())
            {
                client.LocalDomain = "lgm.gov.my";
                await client.ConnectAsync(_config.GetSection("EmailHost").Value, 25, SecureSocketOptions.None).ConfigureAwait(false);
                await client.SendAsync(mimeEmail).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }

        private string GenerateHtmlRejectUser()
        {
            //Please click<a href= 'https://www5.lgm.gov.my/RRIMestet' > e - Estate </ a >
            string htmlMessage = @"
            <html>
                <body>
                    <h2>Assalamualaikum wbt & Greetings,</h2>
                    <p>
                        To whom it may concern,<br/><br/>
                        Your account has been deactivated due to an existing account found! 
                        Please click <a href='https://www5.lgm.gov.my/trainingE-estate'>RRIMestet</a> 
                        and click on 'Contact Us' for any enquiries.<br/><br/>
                        Thank you,<br/>
                        RRIMestet Admin<br/><br/>
                        <i>Attention: This message is automatically generated by the system.</i>
                    </p>
                </body>
            </html>";
            return htmlMessage;
        }

    }
}

