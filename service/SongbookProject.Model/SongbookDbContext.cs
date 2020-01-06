using Microsoft.EntityFrameworkCore;
using SongbookProject.Entities;
using SongbookProject.Model.Entities;

namespace SongbookProject.Data
{
    public class SongbookDbContext : DbContext
    {
        public SongbookDbContext(DbContextOptions<SongbookDbContext> options) : base(options) { }

        public DbSet<TextAsset> TextAssets { get; set; }
        public DbSet<Song> Songs { get; set; }
        public DbSet<Language> Languages { get; set; }
    }
}
