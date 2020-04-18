using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;

namespace SongbookProject.Model
{
    public interface IDbInitializer
    {
        Task EnsurePopulated(IApplicationBuilder app);
    }
}
