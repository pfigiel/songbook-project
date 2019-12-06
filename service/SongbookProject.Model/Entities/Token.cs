using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SongbookProject.Model.Entities
{
    public class Token
    {
        private readonly SecurityToken _token;
        private readonly JwtSecurityTokenHandler _tokenHandler;

        public Token(List<Claim> claims, DateTime expires, byte[] secret)
        {
            _tokenHandler = new JwtSecurityTokenHandler();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = expires,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256Signature)
            };
            _token = _tokenHandler.CreateToken(tokenDescriptor);
        }

        public string Write()
        {
            return _tokenHandler.WriteToken(_token);
        }
    }
}
