using System.Net.Mail;
using System.Net;

namespace CarAndAllReactASP.Server
{
    public interface ISenderEmail
    {
        Task SendEmailAsync(string ToEmail, string Subject, string Body, bool IsHtml = false);
    }
    public class MailSender : ISenderEmail
    {
        private readonly IConfiguration _configuration;
        public MailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public Task SendEmailAsync(string ToEmail, string Subject, string Body, bool IsHtml = false)
        {
            string MailServer = _configuration["EmailSettings:MailServer"];
            string FromEmail = _configuration["EmailSettings:FromEmail"];
            string Password = _configuration["EmailSettings:Password"];
            int Port = int.Parse(_configuration["EmailSettings:MailPort"]);
            var client = new SmtpClient(MailServer, Port)
            {
                Credentials = new NetworkCredential(FromEmail, Password),
                EnableSsl = true,
            };
            MailMessage mailMessage = new MailMessage(FromEmail, ToEmail, Subject, Body)
            {
                IsBodyHtml = IsHtml
            };
            return client.SendMailAsync(mailMessage);
        }
    }
}
