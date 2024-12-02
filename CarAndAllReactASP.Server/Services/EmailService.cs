using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace CarAndAllReactASP.Services{
public class EmailService
{
    private readonly string _smtpHost;
    private readonly int _smtpPort;
    private readonly string _smtpUser;
    private readonly string _smtpPass;

    public EmailService(string smtpHost, int smtpPort, string smtpUser, string smtpPass)
    {
        _smtpHost = smtpHost;
        _smtpPort = smtpPort;
        _smtpUser = smtpUser;
        _smtpPass = smtpPass;
    }

    public async Task SendConfirmationEmail(string toEmail, string companyName)
    {
        if (string.IsNullOrWhiteSpace(toEmail))
        {
            throw new ArgumentException("Email address cannot be empty.", nameof(toEmail));
        }

        if (string.IsNullOrWhiteSpace(companyName))
        {
            throw new ArgumentException("Company name cannot be empty.", nameof(companyName));
        }

        var fromEmail = new MailAddress(_smtpUser, companyName);
        var toEmailAddress = new MailAddress(toEmail);
        var subject = "Bevestiging van uw e-mailadres";
        var body = $"<strong>Dank u voor uw registratie bij {companyName}!</strong><br/>Klik op de onderstaande link om uw e-mailadres te bevestigen.";

        using (var smtpClient = new SmtpClient(_smtpHost, _smtpPort))
        {
            smtpClient.Credentials = new NetworkCredential(_smtpUser, _smtpPass);
            smtpClient.EnableSsl = true;

            var mailMessage = new MailMessage
            {
                From = fromEmail,
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(toEmailAddress);

            try
            {
                await smtpClient.SendMailAsync(mailMessage);
                Console.WriteLine("E-mail succesvol verzonden!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Fout bij het verzenden van de e-mail: {ex.Message}");
            }
        }
    }
}
}