using System;

namespace SongbookProject.Model.Entities
{
    public class RefreshToken
    {
        public int Id { get; set; }
        public string Token { get; private set; }
        public DateTime Expires { get; private set; }
        public string UserId { get; private set; }
        public bool Active => DateTime.UtcNow <= Expires;
        //public string RemoteIpAddress { get; private set; }

        public RefreshToken(string token, DateTime expires, string userId/*, string remoteIpAddress*/)
        {
            Token = token;
            Expires = expires;
            UserId = userId;
            //RemoteIpAddress = remoteIpAddress;
        }
    }
}
