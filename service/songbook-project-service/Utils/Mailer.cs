using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace songbook_project_service.Utils
{
    public class Mailer
    {
        private readonly SmtpClient client;
        private readonly IConfiguration configuration;
        private readonly ILogger logger;

        public Mailer(IConfiguration configuration, ILogger logger)
        {
            this.configuration = configuration;
            this.logger = logger;
            client = new SmtpClient(configuration.GetValue<string>("SmtpServerName"))
            {
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(configuration.GetValue<string>("SmtpUsername"), configuration.GetValue<string>("SmtpPassword")),
                Port = configuration.GetValue<int>("SmtpPort")
            };
        }

        public bool SendAccountActivationMessage(string recipient, string activationLink)
        {
            return SendMessage(
                new string[] { recipient },
                "Songbook Project Account Activation",
                string.Format("Hello, please click the link below to activate your account\r\n{0}", activationLink));
        }

        public bool SendMessage(string[] recipients, string subject, string body)
        {
            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(configuration.GetValue<string>("SmtpUsername")),
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
