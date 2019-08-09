using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Options;
using songbook_project_service.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data
{
    public interface IDbInitializer
    {
        Task EnsurePopulated(IApplicationBuilder app);
    }
}
