using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using songbook_project_service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Services
{
    public interface IIdentityService
    {
        Task<bool> RegisterAsync(User user, HttpContext context);
        Task<User> AuthenticateAsync(User user);
        Task<bool> ActivateAsync(string activationCode);
    }
}
