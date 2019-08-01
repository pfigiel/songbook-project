using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Context
{
    public class SongVersion
    {
        public int Id { get; set; }
        public TextAsset VersionName { get; set; }
        public TextAsset Text { get; set; }
    }
}
