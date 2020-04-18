using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SongbookProject.Model.ViewModels
{
    public class SongViewModel
    {
        public int Id { get; set; }
        public string Artist { get; set; }
        public string Title { get; set; }
        public string OriginalTitle { get; set; }
        public string Arrangement { get; set; }
        public string Text { get; set; }
        public string Language { get; set; }

        public bool Validate(SongbookDbContext context)
        {
            return Title != "" && OriginalTitle != "" && Artist != "" && Arrangement != "" && context.Languages.Any(l => l.Code == Language);
        }
    }
}
