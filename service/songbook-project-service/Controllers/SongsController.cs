using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using songbook_project_service.Context;

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
        public IEnumerable<string> Get()
        {
            var songs = Context.SongMetadatas.Include("Title");
            List<string> songTitles = new List<string>();
            foreach (var song in songs)
            {
                songTitles.Add(song.Title.TextEn);
            }

            return songTitles;
        }
    }
}