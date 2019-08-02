using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Context
{
    public class SongMetadata
    {
        public int Id { get; set; }
        public string Artist { get; set; }
        public TextAsset Title { get; set; }
        public TextAsset Text { get; set; }
    }
}
