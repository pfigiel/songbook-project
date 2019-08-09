using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Services
{
    public interface IMailerService
    {
        bool SendAccountActivationMessage(string recipient, string activationLink);
    }
}
