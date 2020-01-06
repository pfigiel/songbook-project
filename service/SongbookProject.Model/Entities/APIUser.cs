using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongbookProject.Entities.API
{
    public class APIUser
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string Token { get; set; }
        public string RefreshToken { get; set; }
        public IList<string> Roles { get; set; }
    }
}
