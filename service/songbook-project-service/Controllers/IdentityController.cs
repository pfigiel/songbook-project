using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using songbook_project_service.Data;
using songbook_project_service.Utils;
using songbook_project_service.ViewModels;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace songbook_project_service.Controllers
{
    public class IdentityController : Controller
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> loginManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly IMailer mailer;
        private readonly IRequestBodyParser bodyParser;

        public IdentityController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> loginManager,
            RoleManager<IdentityRole> roleManager,
            IMailer mailer,
            IRequestBodyParser bodyParser)
        {
            this.userManager = userManager;
            this.loginManager = loginManager;
            this.roleManager = roleManager;
            this.mailer = mailer;
            this.bodyParser = bodyParser;
        }

        [HttpPost]
        [Route("/register")]
        public IActionResult Register([FromBody]RegisterViewModel viewModel)
        {
            //var viewModel = bodyParser.Parse<RegisterViewModel>(Request);
            var user = new IdentityUser
            {
                Email = viewModel.Email,
                UserName = viewModel.Email,
                EmailConfirmed = false
            };
            var userCreateResult = userManager.CreateAsync(user, viewModel.Password).Result;

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
                    userManager.AddToRoleAsync(user, RoleNames.Default).Wait();
                    var activationMessageSuccess = mailer.SendAccountActivationMessage(viewModel.Email, $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/activate/{user.Id}");
                    if (activationMessageSuccess)
                    {
                        return Ok();
                    }
                }
            }

            return BadRequest();
        }

        [HttpGet]
        [Route("/test")]
        public IActionResult Test()
        {
            return Ok(new { isOk = true });
        }
    }
}
