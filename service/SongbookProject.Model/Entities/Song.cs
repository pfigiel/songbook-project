using System;
using System.Linq;
using SongbookProject.Model.ViewModels;

namespace SongbookProject.Model.Entities
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
