using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SongbookProject.Entities.API;
using SongbookProject.Services;

namespace SongbookProject.API.Controllers
{
    [Route("[controller]")]
    public class IdentityController : Controller
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMailerService _mailer;
        private readonly IConfiguration _configuration;
        private readonly IIdentityService _service;

        public IdentityController(
            UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            RoleManager<IdentityRole> roleManager,
            IMailerService mailer,
            IConfiguration configuration,
            IIdentityService service)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mailer = mailer;
            _configuration = configuration;
            _service = service;
        }

        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody]APIUser user)
        {
            if (await _service.RegisterAsync(user, HttpContext))
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }

        [HttpGet]
        [Route("activate/{activationCode}")]
        public async Task<IActionResult> Activate(string activationCode)
        {
            if (await _service.ActivateAsync(activationCode))
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
        public async Task<IActionResult> Authenticate([FromBody]APIUser user)
        {
            var authenticatedUser = await _service.AuthenticateAsync(user);
            if (authenticatedUser.Token != null)
            {
                return Ok(user);
            }
            else
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        [Authorize]
        [Route("validateToken")]
        public async Task<IActionResult> ValidateToken()
        {
            var user = await _userManager.FindByIdAsync(User.Identity.Name);
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new APIUser() { Email = user.Email, Roles = roles });
        }

        [HttpPost]
        [Authorize]
        [Route("signOut")]
        public async Task<IActionResult> SignOutAsync([FromBody]APIUser user)
        {
            if (Request.Headers.TryGetValue("Authorization", out var token))
            {
                if (await _service.SignOutAsync(user.RefreshToken))
                {
                    return Ok();
                }
            }

            return BadRequest();
        }

        [HttpPost]
        [Route("refreshToken")]
        public async Task<IActionResult> RefreshTokenAsync([FromBody]APIUser user)
        {
            var refreshResult = await _service.RefreshToken(user.RefreshToken);
            
            if (refreshResult != null)
            {
                return Ok(refreshResult);
            }

            return BadRequest();
        }
    }
}
