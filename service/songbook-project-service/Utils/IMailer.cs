using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Utils
{
    public interface IMailer
    {
        bool SendAccountActivationMessage(string recipient, string activationLink);
    }
}
