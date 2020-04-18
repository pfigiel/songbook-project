using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APIUser = SongbookProject.Model.Entities.APIUser;

namespace SongbookProject.Services
{
    public interface IIdentityService
    {
        Task<bool> RegisterAsync(APIUser user, HttpContext context);
        Task<APIUser> AuthenticateAsync(APIUser user);
        Task<bool> ActivateAsync(string activationCode);
        Task<bool> SignOutAsync(string token);
        Task<APIUser> RefreshToken(string refreshToken);
    }
}
