using CarAndAllReactASP.Server;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

/// <summary>
/// This class is responsible for sending emails using SendGrid.
/// </summary>
public class EmailSender : IEmailSender
{
    private readonly ILogger _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="EmailSender"/> class.
    /// </summary>
    /// <param name="optionsAccessor">The options accessor for AuthMessageSenderOpt.</param>
    /// <param name="logger">The logger instance.</param>
    public EmailSender(IOptions<AuthMessageSenderOpt> optionsAccessor,
        ILogger<EmailSender> logger)
    {
        Options = optionsAccessor.Value;
        _logger = logger;
    }

    /// <summary>
    /// Gets the options for the AuthMessageSender.
    /// </summary>
    public AuthMessageSenderOpt Options { get; }

    /// <summary>
    /// Sends an email asynchronously.
    /// </summary>
    /// <param name="toEmail">The recipient email address.</param>
    /// <param name="subject">The subject of the email.</param>
    /// <param name="message">The message content of the email.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    /// <exception cref="Exception">Thrown when the SendGrid API key is null or empty.</exception>
    public async Task SendEmailAsync(string toEmail, string subject, string message)
    {
        if (string.IsNullOrEmpty(Options.SENDGRIDKEY))
        {
            throw new Exception("Null SendGridKey");
        }
        await Execute(Options.SENDGRIDKEY, subject, message, toEmail);
    }

    /// <summary>
    /// Executes the email sending process using SendGrid.
    /// </summary>
    /// <param name="apiKey">The SendGrid API key.</param>
    /// <param name="subject">The subject of the email.</param>
    /// <param name="message">The message content of the email.</param>
    /// <param name="toEmail">The recipient email address.</param>
    /// <returns>A task that represents the asynchronous operation.</returns>
    private async Task Execute(string apiKey, string subject, string message, string toEmail)
    {
        var client = new SendGridClient(apiKey);
        var msg = new SendGridMessage()
        {
            From = new EmailAddress("23052279@student.hhs.nl", "Account Confirmation"),
            Subject = subject,
            PlainTextContent = message,
            HtmlContent = message
        };
        msg.AddTo(new EmailAddress(toEmail));
        msg.SetClickTracking(false, false);
        var response = await client.SendEmailAsync(msg);
        _logger.LogInformation(response.IsSuccessStatusCode
            ? $"Email to {toEmail} queued successfully!"
            : $"Failure Email to {toEmail}");
    }
}
