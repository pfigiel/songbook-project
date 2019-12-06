using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongbookProject.Services
{
    public interface IMailerService
    {
        bool SendAccountActivationMessage(string recipient, string activationLink);
    }
}
