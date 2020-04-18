using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SongbookProject.Model.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SongbookProject.Services.Identity
{
    public interface ITokenFactory
    {
        Task<Token> GenerateToken(IdentityUser user);
        RefreshToken GenerateRefreshToken(IdentityUser user);
    }
}
