using SongbookProject.Data;
using SongbookProject.Model.Entities;
using SongbookProject.Model.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SongbookProject.Entities
{
    public class Song
    {
        public int Id { get; set; }
        public string Artist { get; set; }
        public string Title { get; set; }
        public string OriginalTitle { get; set; }
        public string Arrangement { get; set; }
        public string Text { get; set; }
        public Language Language { get; set; }
        public DateTime CreatedAt { get; set; }

        public Song() { }

        public Song(SongViewModel viewModel, SongbookDbContext context)
        {
            Id = viewModel.Id;
            Title = viewModel.Title;
            OriginalTitle = viewModel.OriginalTitle;
            Artist = viewModel.Artist;
            Arrangement = viewModel.Arrangement;
            Text = viewModel.Text;
            Language = context.Languages.Where(l => l.Code == viewModel.Language).FirstOrDefault();
            CreatedAt = DateTime.Now;
        }
    }
}
