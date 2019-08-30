using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using songbook_project_service.Entities;
using songbook_project_service.Utils;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace songbook_project_service.Services
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IMailerService mailer;
        private readonly IConfiguration configuration;

        public IdentityService(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<IdentityUser> signInManager,
            IMailerService mailer,
            IConfiguration configuration)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.mailer = mailer;
            this.configuration = configuration;
        }

        public async Task<bool> RegisterAsync(User user, HttpContext context)
        {
            var identityUser = new IdentityUser
            {
                Email = user.Email,
                UserName = user.Email,
                EmailConfirmed = false
            };
            var userCreateResult = userManager.CreateAsync(identityUser, user.Password).Result;

            if (userCreateResult.Succeeded)
            {
                var defaultRoleExists = roleManager.RoleExistsAsync(RoleNames.Default).Result;
                var roleCreateSucceeded = false;
                if (!roleManager.RoleExistsAsync(RoleNames.Default).Result)
                {
                    var defaultRole = new IdentityRole
                    {
                        Name = RoleNames.Default
                    };
                    roleCreateSucceeded = roleManager.CreateAsync(defaultRole).Result.Succeeded;
                }
                if (defaultRoleExists || roleCreateSucceeded)
                {
                    await userManager.AddToRoleAsync(identityUser, RoleNames.Default);
                    var activationMessageSuccess = mailer.SendAccountActivationMessage(user.Email, $"{context.Request.Scheme}://{context.Request.Host}/activate/{identityUser.Id}");
                    if (activationMessageSuccess)
                    {
                        return true;
                    }
                }
            }

            return false;
        }

        public async Task<User> AuthenticateAsync(User user)
        {
            user.Token = null;
            var identityUser = await userManager.FindByEmailAsync(user.Email);
            if (identityUser == null || !identityUser.EmailConfirmed)
            {
                return user;
            }

            await signInManager.SignOutAsync();
            var result = await signInManager.PasswordSignInAsync(identityUser, user.Password, true, false);
            if (result.Succeeded)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(configuration.GetValue<string>("JWTSecret"));
                var claims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, identityUser.Id.ToString())
                };
                foreach (var role in await userManager.GetRolesAsync(identityUser))
                {
                    claims.Add(new Claim(ClaimTypes.Role, role));
                }
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.UtcNow.AddDays(7),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var token = tokenHandler.CreateToken(tokenDescriptor);
                user.Token = tokenHandler.WriteToken(token);
            }

            user.Password = null;
            return user;
        }

        public async Task<bool> ActivateAsync(string activationCode)
        {
            var identityUser = await userManager.FindByIdAsync(activationCode);
            if (identityUser != null)
            {
                identityUser.EmailConfirmed = true;
                await userManager.UpdateAsync(identityUser);
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
