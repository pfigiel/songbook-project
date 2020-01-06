using SongbookProject.Data;
using SongbookProject.Entities;
using SongbookProject.Model.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SongbookProject.Services
{
    public class SongsService : ISongsService
    {
        private readonly SongbookDbContext _context;

        public SongsService(SongbookDbContext context)
        {
            _context = context;
        }

        public Song AddSong(SongViewModel viewModel)
        {
            var song = new Song(viewModel, _context);

            try
            {
                _context.Songs.Add(song);
                _context.SaveChanges();

                return song;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Song ModifySong(SongViewModel viewModel)
        {
            var song = new Song(viewModel, _context);

            try
            {
                _context.Songs.Update(song);
                _context.SaveChanges();

                return song;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public bool DeleteSong(int id)
        {
            var song = _context.Songs.Where(s => s.Id == id).FirstOrDefault();
            if (song != null)
            {
                _context.Songs.Remove(song);
                _context.SaveChanges();
                return true;
            }

            return false;
        }
    }
}
