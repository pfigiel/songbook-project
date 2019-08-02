using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using songbook_project_service.Context;
using songbook_project_service.Data.Context.Translations;

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
            var songs = Context.SongMetadatas.Include("Title").Include("Text");
            var songsToSend = new List<object>();
            foreach (var song in songs)
            {
                songsToSend.Add(new
                {
                    title = Translator.Translate(song.Title, language),
                    text = Translator.Translate(song.Text, language),
                    artist = song.Artist,
                });
            }
            return songsToSend;
        }
    }
}