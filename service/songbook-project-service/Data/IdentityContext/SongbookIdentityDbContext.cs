using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data.IdentityContext
{
    public class SongbookIdentityDbContext : IdentityDbContext
    {
        public SongbookIdentityDbContext(DbContextOptions<SongbookIdentityDbContext> options) : base(options) { }
    }
}
