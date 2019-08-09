using songbook_project_service.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data.Repositories
{
    public class SongsRepository : ISongsRepository
    {
        private readonly SongbookDbContext context;

        public SongsRepository(SongbookDbContext context)
        {
            this.context = context;
        }

        public Song GetSong(Song filter)
        {
            return context.Songs.Find(filter);
        }

        public IEnumerable<Song> GetSongs(Song filter)
        {
            return context.Songs.Where(song => song.Arrangement == filter.Arrangement);
            //var filteredSongs = new List<Song>();
            //foreach (var song in context.Songs)
            //{
            //    if (song.)
            //}
        }
    }
}
