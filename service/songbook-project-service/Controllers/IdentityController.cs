using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using songbook_project_service.Entities;
using songbook_project_service.Services;
using songbook_project_service.Utils;

namespace songbook_project_service.Controllers
{
    [Route("[controller]")]
    public class IdentityController : Controller
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<IdentityUser> signInManager;
        private readonly IMailerService mailer;
        private readonly IConfiguration configuration;
        private readonly IIdentityService service;

        public IdentityController(
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<IdentityUser> signInManager,
            IMailerService mailer,
            IConfiguration configuration,
            IIdentityService service)
        {
            this.userManager = userManager;
            this.roleManager = roleManager;
            this.signInManager = signInManager;
            this.mailer = mailer;
            this.configuration = configuration;
            this.service = service;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody]User user)
        {
            if (await service.RegisterAsync(user, HttpContext))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpPost]
        [Route("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]User user)
        {
            var authenticatedUser = await service.AuthenticateAsync(user);
            if (authenticatedUser.Token != null)
            {
                return Ok(user);
            }
            else
            {
                return Unauthorized();
            }
        }
    }
}
