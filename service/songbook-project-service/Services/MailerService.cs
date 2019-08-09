using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace songbook_project_service.Services
{
    public class MailerService : IMailerService
    {
        private readonly SmtpClient client;
        private readonly IConfiguration configuration;
        private readonly ILogger logger;

        public MailerService(IConfiguration configuration, ILogger<MailerService> logger)
        {
            this.configuration = configuration;
            this.logger = logger;
            client = new SmtpClient(configuration.GetValue<string>("Mailer:SmtpServerName"))
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(configuration.GetValue<string>("Mailer:SmtpUsername"), configuration.GetValue<string>("Mailer:SmtpPassword")),
                Port = configuration.GetValue<int>("Mailer:SmtpPort"),
                EnableSsl = true
            };
        }

        public bool SendAccountActivationMessage(string recipient, string activationLink)
        {
            return SendMessage(
                new string[] { recipient },
                "Songbook Project Account Activation",
                string.Format("Hello, please click the link below to activate your account\r\n{0}", activationLink));
        }

        private bool SendMessage(string[] recipients, string subject, string body)
        {
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(configuration.GetValue<string>("Mailer:SmtpUsername")),
                Body = body,
                Subject = subject
            };
            foreach (var recipient in recipients)
            {
                mailMessage.To.Add(recipient);
            }
            try
            {
                client.Send(mailMessage);
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
            }

            return false;
        }
    }
}
