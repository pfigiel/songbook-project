using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using SongbookProject.Model;
using SongbookProject.Model.Entities;
using SongbookProject.Model.Utils;
using SongbookProject.Services.Identity;

namespace SongbookProject.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IMailerService _mailer;
        private readonly IConfiguration _configuration;
        private readonly SongbookIdentityDbContext _identityDbContext;
        private readonly ITokenFactory _tokenFactory;

        public IdentityService(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<IdentityUser> signInManager,
            IMailerService mailer,
            IConfiguration configuration,
            SongbookIdentityDbContext identityDbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mailer = mailer;
            _configuration = configuration;
            _identityDbContext = identityDbContext;
            _tokenFactory = new TokenFactory(userManager, configuration);
        }

        public async Task<bool> RegisterAsync(APIUser user, HttpContext context)
        {
            var identityUser = new IdentityUser
            {
                Email = user.Email,
                UserName = user.Email,
                EmailConfirmed = false
            };
            var userCreateResult = _userManager.CreateAsync(identityUser, user.Password).Result;

            if (userCreateResult.Succeeded)
            {
                var defaultRoleExists = _roleManager.RoleExistsAsync(RoleNames.Default).Result;
                var roleCreateSucceeded = false;
                if (!_roleManager.RoleExistsAsync(RoleNames.Default).Result)
                {
                    var defaultRole = new IdentityRole
                    {
                        Name = RoleNames.Default
                    };
                    roleCreateSucceeded = _roleManager.CreateAsync(defaultRole).Result.Succeeded;
                }
                if (defaultRoleExists || roleCreateSucceeded)
                {
                    await _userManager.AddToRoleAsync(identityUser, RoleNames.Default);
                    var activationMessageSuccess = _mailer.SendAccountActivationMessage(user.Email, $"{context.Request.Scheme}://{context.Request.Host}/identity/activate/{identityUser.Id}");
                    if (activationMessageSuccess)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<APIUser> AuthenticateAsync(APIUser user)
        {
            user.Token = null;
            var identityUser = await _userManager.FindByEmailAsync(user.Email);
            if (identityUser == null || !identityUser.EmailConfirmed)
            {
                return user;
            }

            await _signInManager.SignOutAsync();
            var signInResult = await _signInManager.PasswordSignInAsync(identityUser, user.Password, true, false);

            if (signInResult.Succeeded)
            {
                var token = await _tokenFactory.GenerateToken(identityUser);
                var refreshToken = _tokenFactory.GenerateRefreshToken(identityUser);

                user.Token = token.Write();
                user.RefreshToken = refreshToken.Token;

                user.Roles = await _userManager.GetRolesAsync(identityUser);

                _identityDbContext.RefreshTokens.Add(refreshToken);
                _identityDbContext.Users.Update(identityUser);
                _identityDbContext.SaveChanges();
            }

            user.Password = null;
            return user;
        }

        public async Task<bool> ActivateAsync(string activationCode)
        {
            var identityUser = await _userManager.FindByIdAsync(activationCode);
            if (identityUser != null)
            {
                identityUser.EmailConfirmed = true;
                await _userManager.UpdateAsync(identityUser);
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> SignOutAsync(string refreshToken)
        {
            var token = _identityDbContext.RefreshTokens.Where(rt => rt.Token == refreshToken).FirstOrDefault();
                
            if (token != null)
            {
                _identityDbContext.RefreshTokens.Remove(token);
                await _identityDbContext.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<APIUser> RefreshToken(string refreshToken)
        {
            var oldRefreshToken = _identityDbContext.RefreshTokens.Where(rt => rt.Token == refreshToken).FirstOrDefault();
            APIUser apiUser = null;

            if (oldRefreshToken != null && oldRefreshToken.Expires >= DateTime.Now)
            {
                var user = await _userManager.FindByIdAsync(oldRefreshToken.UserId);

                var newToken = await _tokenFactory.GenerateToken(user);
                var newRefreshToken = _tokenFactory.GenerateRefreshToken(user);

                _identityDbContext.RefreshTokens.Add(newRefreshToken);

                apiUser = new APIUser() { Email = user.Email, Token = newToken.Write(), RefreshToken = newRefreshToken.Token, Roles = await _userManager.GetRolesAsync(user) };
            }

            _identityDbContext.RefreshTokens.Remove(oldRefreshToken);
            _identityDbContext.SaveChanges();

            return apiUser;
        }
    }
}
