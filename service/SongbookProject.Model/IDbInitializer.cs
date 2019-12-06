using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongbookProject.Data
{
    public interface IDbInitializer
    {
        Task EnsurePopulated(IApplicationBuilder app);
    }
}
