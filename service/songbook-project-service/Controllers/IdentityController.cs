using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using songbook_project_service.Data;
using songbook_project_service.Entities;
using songbook_project_service.Utils;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace songbook_project_service.Controllers
{
    public class IdentityController : Controller
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> loginManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IMailer mailer;
        private readonly IRequestBodyParser bodyParser;
        private readonly IConfiguration configuration;

        public IdentityController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> loginManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<IdentityUser> signInManager,
            IMailer mailer,
            IRequestBodyParser bodyParser,
            IConfiguration configuration)
        {
            this.userManager = userManager;
            this.loginManager = loginManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.mailer = mailer;
            this.bodyParser = bodyParser;
            this.configuration = configuration;
        }

        [HttpPost]
        [Route("/register")]
        public IActionResult Register([FromBody]User user)
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
                    userManager.AddToRoleAsync(identityUser, RoleNames.Default).Wait();
                    var activationMessageSuccess = mailer.SendAccountActivationMessage(user.Email, $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/activate/{identityUser.Id}");
                    if (activationMessageSuccess)
                    {
                        return Ok();
                    }
                }
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("/authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]User user)
        {
            var identityUser = await userManager.FindByEmailAsync(user.Email ?? "");
            if (identityUser == null)
            {
                return BadRequest();
            }

            await signInManager.SignOutAsync();
            var result = await signInManager.PasswordSignInAsync(identityUser, user.Password, true, false);
            if (result.Succeeded)
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(configuration.GetValue<string>("JWTSecret"));
                var claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.Name, identityUser.Id.ToString()));
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

                user.Password = null;

                return Ok(user);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        [Authorize(Roles = RoleNames.Admin)]
        [Route("/auth")]
        public IActionResult AuthTest()
        {
            return Ok();
        }

        [HttpGet]
        [Route("/test")]
        public object Test()
        {
            return User.Claims.Select(claims =>
            new
            {
                Type = claims.Type,
                Values = claims.Value
            });
            //return Ok(new { isOk = true });
        }
    }
}
