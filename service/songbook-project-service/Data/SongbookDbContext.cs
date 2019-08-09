using Microsoft.EntityFrameworkCore;
using songbook_project_service.Entities;

namespace songbook_project_service.Data
{
    public class SongbookDbContext : DbContext
    {
        public SongbookDbContext(DbContextOptions<SongbookDbContext> options) : base(options) { }

        public DbSet<TextAsset> TextAssets { get; set; }
        public DbSet<Song> Songs { get; set; }
    }
}
