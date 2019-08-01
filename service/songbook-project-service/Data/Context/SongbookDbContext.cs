using Microsoft.EntityFrameworkCore;
using songbook_project_service.Context.Translations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Context
{
    public class SongbookDbContext : DbContext
    {
        public SongbookDbContext(DbContextOptions options) : base(options) { }

        public DbSet<TextAsset> TextAssets { get; set; }
        public DbSet<SongMetadata> SongMetadatas { get; set; }
        public DbSet<SongVersion> SongVersions { get; set; }
    }
}
