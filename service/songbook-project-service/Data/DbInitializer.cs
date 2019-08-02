using songbook_project_service.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data
{
    public static class DbInitializer
    {
        public static void Initialize(SongbookDbContext context)
        {
            context.Database.EnsureCreated();

            // Some of the collections are empty, some are not - unexpected situation, clear collections
            if (context.SongMetadatas.Any() ^ context.TextAssets.Any())
            {
                foreach (var songMetadata in context.SongMetadatas)
                {
                    context.SongMetadatas.Remove(songMetadata);
                }
                foreach (var textAsset in context.TextAssets)
                {
                    context.TextAssets.Remove(textAsset);
                }
                context.SaveChanges();
            }

            // All collections are empty - populate
            if (!context.SongMetadatas.Any() && !context.TextAssets.Any())
            {
                var textAssets = new TextAsset[]
                {
                    new TextAsset() { TextEn = "Song 1", TextPl = "Piosenka 1" },
                    new TextAsset() { TextEn = "Song 2", TextPl = "Piosenka 2" },
                    new TextAsset() { TextEn = "Song 3", TextPl = "Piosenka 3" },
                    new TextAsset() { TextEn = "Song 1 Text", TextPl = "Piosenka 1 Tekst" },
                    new TextAsset() { TextEn = "Song 2 Text", TextPl = "Piosenka 2 Tekst" },
                    new TextAsset() { TextEn = "Song 3 Text", TextPl = "Piosenka 3 Tekst" },
                };
                foreach (var textAsset in textAssets)
                {
                    context.TextAssets.Add(textAsset);
                }
                context.SaveChanges();

                var songMetadatas = new SongMetadata[]
                {
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[0],
                        Text = textAssets[3]
                    },
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[1],
                        Text = textAssets[4]
                    },
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[2],
                        Text = textAssets[5]
                    }
                };
                foreach (var songMetadata in songMetadatas)
                {
                    context.SongMetadatas.Add(songMetadata);
                }
                context.SaveChanges();
            }
        }
    }
}
