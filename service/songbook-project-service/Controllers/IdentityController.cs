using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using songbook_project_service.Data;
using songbook_project_service.Utils;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace songbook_project_service.Controllers
{
    public class IdentityController : Controller
    {
        private readonly UserManager<IdentityUser> userManager;
        private readonly SignInManager<IdentityUser> loginManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly Mailer mailer;

        public IdentityController(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> loginManager, RoleManager<IdentityRole> roleManager, Mailer mailer)
        {
            this.userManager = userManager;
            this.loginManager = loginManager;
            this.roleManager = roleManager;
            this.mailer = mailer;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [Route("/register")]
        public IActionResult Register(string email, string password)
        {
            var user = new IdentityUser
            {
                Email = email,
                EmailConfirmed = false
            };
            var userCreateResult = userManager.CreateAsync(user, password).Result;

            if (userCreateResult.Succeeded)
            {
                if (!roleManager.RoleExistsAsync(RoleNames.Default).Result)
                {
                    var defaultRole = new IdentityRole
                    {
                        Name = RoleNames.Default
                    };
                    var roleCreateResult = roleManager.CreateAsync(defaultRole).Result;
                    if (roleCreateResult.Succeeded)
                    {
                        userManager.AddToRoleAsync(user, RoleNames.Default).Wait();
                        var activationMessageSuccess = mailer.SendAccountActivationMessage(email, $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host}/activate/{user.Id}");
                        if (activationMessageSuccess)
                        {
                            return Ok();
                        }
                    }
                }
            }

            return BadRequest();
        }
    }
}
