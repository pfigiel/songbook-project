using System.Collections.Generic;

namespace SongbookProject.Model.Entities
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
