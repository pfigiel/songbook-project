using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using songbook_project_service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data
{
    public class SongbookIdentityDbContext : IdentityDbContext
    {
        public SongbookIdentityDbContext(DbContextOptions<SongbookIdentityDbContext> options) : base(options) { }
        public DbSet<BlacklistToken> BlacklistTokens { get; set; }
    }
}
