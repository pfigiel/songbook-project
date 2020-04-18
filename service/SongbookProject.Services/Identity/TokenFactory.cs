using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using SongbookProject.Model.Entities;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace SongbookProject.Services.Identity
{
    class TokenFactory : ITokenFactory
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly DateTime _tokenExpirationTime = DateTime.UtcNow.AddMinutes(5);
        private readonly DateTime _refreshTokenExpirationTime = DateTime.UtcNow.AddDays(1);

        public TokenFactory(UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<Token> GenerateToken(IdentityUser user)
        {
            var secret = Encoding.ASCII.GetBytes(_configuration.GetValue<string>("JWTSecret"));
            var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.Id) };
            foreach (var role in await _userManager.GetRolesAsync(user))
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            return new Token(claims, _tokenExpirationTime, secret);
        }

        public RefreshToken GenerateRefreshToken(IdentityUser user)
        {
            var refreshTokenBase = "";
            var random = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(random);
                refreshTokenBase = Convert.ToBase64String(random);
            }

            return new RefreshToken(refreshTokenBase, _refreshTokenExpirationTime, user.Id);
        }
    }
}
