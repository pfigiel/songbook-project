using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace songbook_project_service.Controllers
{
    public class SongsController : Controller
    {
        [Route("/[controller]")]
        //public ActionResult<IEnumerable<string>> Get()
        public IEnumerable<string> Get()
        {
            return new string[] { "Song 1", "Song 2" };
        }
    }
}