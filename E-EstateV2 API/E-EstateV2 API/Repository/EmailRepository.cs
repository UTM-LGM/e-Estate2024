using E_EstateV2_API.Models;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using MailKit.Net.Smtp;
using E_EstateV2_API.IRepository;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using E_EstateV2_API.ViewModel;
using System.Net;
using System.Web;

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
                email.From.Add(MailboxAddress.Parse("RRIMestet@lgm.gov.my"));
                //user email
                email.To.Add(MailboxAddress.Parse(request.to));
                email.Subject = "Account Verification for RRIMestet LGM";
                string htmlMessageRegister = GenerateHtmlRegister(request);
                email.Body = new TextPart(TextFormat.Html) { Text = htmlMessageRegister };
            }
            else
            {
                //user email
                email.From.Add(MailboxAddress.Parse(request.from));
                //admin email
                email.To.Add(MailboxAddress.Parse("Embong@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse("fattah@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse("azimah@lgm.gov.my"));
                email.Subject = "Notice to add country for RRIMestet LGM";
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
                user.isActive = true;
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
                email.From.Add(MailboxAddress.Parse("RRIMestet@lgm.gov.my"));
                //Admin email
                email.To.Add(MailboxAddress.Parse("Embong@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse("fattah@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse("azimah@lgm.gov.my"));
                email.Subject = "Notice to verify new RRIMestet user";
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
                return IdentityResult.Failed(new IdentityError { Description = "Invalid or expired token." });
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
                email.From.Add(MailboxAddress.Parse("RRIMestet@lgm.gov.my"));
                email.To.Add(MailboxAddress.Parse(user.email));
                email.Subject = "Password Reset for RRIMestet LGM";
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
            else
            {
                throw new ApplicationException("Invalid email address or email is not verified.");
            }
        }

        private string GenerateHtmlResetPassword(string userId, string token)
        {
            byte[] plainBytesUserId = System.Text.Encoding.UTF8.GetBytes(userId);
            string idEncoded = Convert.ToBase64String(plainBytesUserId);

            byte[] plainBytesToken = System.Text.Encoding.UTF8.GetBytes(token);
            string tokenEncoded = Convert.ToBase64String(plainBytesToken);


            //string urlEncodedToken = UrlEncodeToken(token);
            //string urlEncodedToken = WebUtility.UrlEncode(token);
            //byte[] plainBytes = System.Text.Encoding.UTF8.GetBytes(userId);
            //string userIdCoded = WebUtility.UrlEncode(userId);
            //string resetLink = $"http://localhost:4200/forgotpassword?userId={idEncoded}&token={tokenEncoded}";

            string resetLink = $"https://www5.lgm.gov.my/RRIMestet/forgotpassword?userId={idEncoded}&token={tokenEncoded}";
            //string resetLink = $"https://lgm20.lgm.gov.my/RRIMestet/forgotpassword?userId={idEncoded}&token={tokenEncoded}";
            //string resetLink = $"https://www5.lgm.gov.my/trainingE-estate/forgotpassword?userId={idEncoded}&token={tokenEncoded}";
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/>" +
                "<br>" +
                "Thank you for registering with RRIMestet. " +
                $"Click the link below to reset your password <br/> <a href=\"{resetLink}\">Reset Password</a><br>" +
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
                 "Thank you for registering with RRIMestet. For security purposes, please click the link provided " +
                 "to verify your email address : <br/><br/> <a href='https://api02.lgm.gov.my/RRIMestetApi/api/emails/verifyEmail/" + plainEncoded + "'>Verify Email</a><br>" +
                 //"to verify your email address : <br/><br/> <a href='https://lgm20.lgm.gov.my/RRIMestetApi/api/emails/verifyEmail/" + plainEncoded + "'>Verify Email</a><br>" +
                 //"to verify your email address : <br/><br/> <a href='https://api02.lgm.gov.my/trainingE-EstateApi/api/emails/verifyEmail/" + plainEncoded + "'>Verify Email</a><br>" +
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

        private string GenerateHtmlCountry(Email request)
        {
            string htmlMessage = "<html>" +
                "<body>" +
                "<h2>Assalamualaikum wbt & Greetings,</h2>" +
                "<p>To whom it may concern,  <br/><br/>" +
                "<p><b><u>NOTICE TO ADD COUNTRY FOR FOREIGN WORKER INFORMATION IN THE RRIMestet SYSTEM</u></b><br/><br/>" +
                "2. We kindly request the cooperation of LGM Admin to add  <b>" + request.country + "</b> to the list of countries for foreign worker information in the RRIMestet system.  <br /><br />" +
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
                "<p><b><u>NOTICE TO NEW RRIMestet USER</u></b><br/><br/>" +
                "We kindly request the cooperation of LGM Admin to verify user in RRIMestet system : <b>" + userName + "</b><br/><br/>" +
                "Please click <a href = 'https://www5.lgm.gov.my/RRIMestet" + "'>Login RRIMestet</a><br/><br/>" +
                //"Please click <a href = 'https://lgm20.lgm.gov.my/RRIMestet" + "'>Login RRIMestet</a><br/><br/>" +
                //"Please click <a href = 'https://www5.lgm.gov.my/trainingE-estate" + "'>Login RRIMestet</a><br/><br/>" +
                "Thank you,<br/>" +
                "<b>RRIMestet System</b></p>" +
                "<i>Attention, this message is automatically generated by the system. <i>" +
                "</body>" +
                "</html>";
            return htmlMessage;
        }
    }
}
