using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SongbookProject.Model.Entities;

namespace SongbookProject.Model
{
    public class SongbookIdentityDbContext : IdentityDbContext
    {
        public SongbookIdentityDbContext(DbContextOptions<SongbookIdentityDbContext> options) : base(options) { }

        public DbSet<RefreshToken> RefreshTokens { get; set; }
    }
}
