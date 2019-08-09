using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using songbook_project_service.Data;
using songbook_project_service.Services;

namespace songbook_project_service.Controllers
{
    public class SongsController : Controller
    {
        public SongsController(SongbookDbContext context)
        {
            Context = context;
        }

        public SongbookDbContext Context { get; set; }

        [Route("/[controller]")]
        public IEnumerable<object> Get()
        {
            var language = Request.Headers["Accept-Language"];
            var songs = Context.SongMetadatas.OrderByDescending(song => song.Title).Include("Title").Include("Text");
            var songsToSend = new List<object>();
            foreach (var song in songs)
            {
                var title = TranslatorService.Translate(song.Title, language);
                var text = TranslatorService.Translate(song.Text, language);
                if (title != null && text != null)
                {
                    songsToSend.Add(new
                    {
                        title,
                        text,
                        arrangement = TranslatorService.Translate(song.Arrangement, language),
                        artist = song.Artist,
                    });
                }
            }
            return songsToSend;
        }
    }
}