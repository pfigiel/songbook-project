using SongbookProject.Entities;
using SongbookProject.Model.ViewModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace SongbookProject.Services
{
    public interface ISongsService
    {
        Song AddSong(SongViewModel viewModel);
        Song ModifySong(SongViewModel viewModel);
        bool DeleteSong(int id);
    }
}
