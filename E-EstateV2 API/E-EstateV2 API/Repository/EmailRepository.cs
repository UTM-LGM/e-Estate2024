using E_EstateV2_API.Models;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using E_EstateV2_API.IRepository;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;
using E_EstateV2_API.ViewModel;

namespace E_EstateV2_API.Repository
{
    public class EmailRepository : IEmailRepository
    {
        private readonly IConfiguration _config;
        private readonly UserManager<ApplicationUser> _usermanager;

        public EmailRepository(IConfiguration config, UserManager<ApplicationUser> userManager)
        {
            _usermanager = userManager;
            _config = config;
        }

        public async Task SendEmail(Email request)
        {
            var email = new MimeMessage();
            if (request.userId == null)
            {
                //system email
                email.From.Add(MailboxAddress.Parse("e-estate@lgm.gov.my"));
                //admin email
                email.To.Add(MailboxAddress.Parse("sabariah@lgm.gov.my"));
                email.Subject = "Account Verification for e-Estate LGM";
                string htmlMessageRegister = GenerateHtmlRegister(request);
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessageRegister };
            }
            else
            {
                //user email
                email.From.Add(MailboxAddress.Parse(request.from));
                //admin email
                email.To.Add(MailboxAddress.Parse("sabariah@lgm.gov.my"));
                email.Subject = "Notice to add country for e-Estate LGM";
                string htmlMessage = GenerateHtmlCountry(request);
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };
            }

            using (var client = new SmtpClient())
            {
                client.LocalDomain = "lgm.gov.my";
                await client.ConnectAsync(_config.GetSection("EmailHost").Value, 25, SecureSocketOptions.None).ConfigureAwait(false);
                await client.SendAsync(email).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
        }


        public async Task VerifyEmail(string encodedData)
        {
            string plainEncoded = encodedData;
            byte[] encodedBytes = Convert.FromBase64String(plainEncoded);
            string userId = Encoding.UTF8.GetString(encodedBytes);

            var user = await _usermanager.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();
            if (user != null)
            {
                user.isEmailVerified = true;
                await _usermanager.UpdateAsync(user);
            }
        }

        public async Task VerifyEmailVerifiedUser(string encodedData)
        {
            string plainEncoded = encodedData;
            byte[] encodedBytes = Convert.FromBase64String(plainEncoded);
            string userId = Encoding.UTF8.GetString(encodedBytes);

            var user = await _usermanager.Users.Where(x => x.Id == userId).FirstOrDefaultAsync();

            if (user != null && user.isEmailVerified == false)
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("e-estate@lgm.gov.my"));
                //Admin email
                email.To.Add(MailboxAddress.Parse("sabariah@lgm.gov.my"));
                email.Subject = "Notice to verify new e-Estate user";
                string htmlMessage = GenerateHtmlUserVerified(user.UserName);
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessage };
                using (var client = new SmtpClient())
                {
                    client.LocalDomain = "lgm.gov.my";
                    await client.ConnectAsync(_config.GetSection("EmailHost").Value, 25, SecureSocketOptions.None).ConfigureAwait(false);
                    await client.SendAsync(email).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
        }

        public async Task<IdentityResult> ResetPassword(DTO_User user)
        {
            var applicationUser = await _usermanager.FindByIdAsync(user.id);

            var originalToken = UrlDecodeToken(user.Token);
            //checking token
            var tokenProvider = _usermanager.Options.Tokens.PasswordResetTokenProvider;

            var tokenValid = await _usermanager.VerifyUserTokenAsync(applicationUser, tokenProvider, "ResetPassword", originalToken);

            if (!tokenValid)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Failed" });
            }

            var result = await _usermanager.ResetPasswordAsync(applicationUser, originalToken, user.NewPassword);
            if (result.Succeeded)
            {
                return result;
            }
            return result;
        }

        public async Task SendPasswordResetEmail(User user)
        {
            var applicationUser = await _usermanager.FindByNameAsync(user.userName);
            var userId = _usermanager.Users.Where(x => x.UserName == user.userName && x.isEmailVerified == true && x.Email == user.email).Select(x => x.Id).FirstOrDefault();
            if (userId != null)
            {
                var token = await _usermanager.GeneratePasswordResetTokenAsync(applicationUser);
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("e-estate@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse(user.email));
                email.Subject = "Password Reset for e-Estate LGM";
                string htmlMessageReset = GenerateHtmlResetPassword(userId, token);
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessageReset };

                using (var client = new SmtpClient())
                {
                    client.LocalDomain = "lgm.gov.my";
                    await client.ConnectAsync(_config.GetSection("EmailHost").Value, 25, SecureSocketOptions.None).ConfigureAwait(false);
                    await client.SendAsync(email).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
            }
        }

        private string GenerateHtmlResetPassword(string userId, string token)
        {
            string urlEncodedToken = UrlEncodeToken(token);
            byte[] plainBytes = System.Text.Encoding.UTF8.GetBytes(userId);
            string userIdCoded = Convert.ToBase64String(plainBytes);
            string resetLink = $"https://lgm20.lgm.gov.my/e-Estate/forgotpassword/{userIdCoded}/{urlEncodedToken}";
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/>" +
                "<br>" +
                "Thank you for registering with e-Estate. " +
                $"Click the link below to reset your password <br/> <a href=\"{resetLink}\">Reset Password</a><br>" +
                "<br>" +
                "Thank you," +
                "<br>" +
                "e-Estate Admin" +
                "<br><br>" +
                "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }

        private string UrlEncodeToken(string token)
        {
            return Uri.EscapeDataString(token);
        }

        private string UrlDecodeToken(string token)
        {
            return Uri.UnescapeDataString(token);
        }

        private string GenerateHtmlRegister(Email request)
        {
            var userId = _usermanager.Users.Where(x => x.UserName == request.userName).Select(x => x.Id).FirstOrDefault();
            byte[] plainBytes = System.Text.Encoding.UTF8.GetBytes(userId);
            string plainEncoded = Convert.ToBase64String(plainBytes);
            string htmlMessage = "<html>" +
                "<body>" +
                 "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                 "<p>To whom it may concern,  <br/>" +
                 "<br>" +
                 "Thank you for registering with e-Estate. For security purposes, please click the link provided " +
                 "to verify your email address : <br/><br/> <a href='https://lgm20.lgm.gov.my/e-EstateApi/api/emails/verifyEmail/" + plainEncoded + "'>Verify Email</a><br>" +
                 "<br>" +
                 "Thank you," +
                 "<br>" +
                 "e-Estate Admin" +
                 "<br><br>" +
                 "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }

        private string GenerateHtmlCountry(Email request)
        {
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/><br/>" +
                "<p><b><u>NOTICE TO ADD COUNTRY FOR FOREIGN WORKER INFORMATION IN THE e-ESTATE SYSTEM</u></b><br/><br/>" +
                "2. We kindly request the cooperation of LGM Admin to add  <b>" + request.country + "</b> to the list of countries for foreign worker information in the e-Estate system.  <br /><br />" +
                "Thank you,<br/>" +
                "<b>" + request.userName + "</b></p>" +
                "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }

        private string GenerateHtmlUserVerified(string userName)
        {
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/><br/>" +
                "<p><b><u>NOTICE TO NEW E-ESTATE USER</u></b><br/><br/>" +
                "We kindly request the cooperation of LGM Admin to verify user in e-Estate system : <b>" + userName + "</b><br/><br/>" +
                "Thank you,<br/>" +
                "<b>e-Estate System</b></p>" +
                "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }
    }
}
