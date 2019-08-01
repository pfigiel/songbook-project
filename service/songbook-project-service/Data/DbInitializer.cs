using songbook_project_service.Context;
using songbook_project_service.Context.Translations;
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
            if (context.SongMetadatas.Any() ^ context.SongVersions.Any() ^ context.TextAssets.Any())
            {
                foreach (var songMetadata in context.SongMetadatas)
                {
                    context.SongMetadatas.Remove(songMetadata);
                }
                foreach (var songVersion in context.SongVersions)
                {
                    context.SongVersions.Remove(songVersion);
                }
                foreach (var textAsset in context.TextAssets)
                {
                    context.TextAssets.Remove(textAsset);
                }
                context.SaveChanges();
            }

            // All collections are empty - populate
            if (!context.SongMetadatas.Any() && !context.SongVersions.Any() && !context.TextAssets.Any())
            {
                var textAssets = new TextAsset[]
                {
                    new TextAsset() { TextEn = "Song 1", TextPl = "Piosenka 1" },
                    new TextAsset() { TextEn = "Song 2", TextPl = "Piosenka 2" },
                    new TextAsset() { TextEn = "Song 3", TextPl = "Piosenka 3" },
                    new TextAsset() { TextEn = "Song 1 Version 1", TextPl = "Piosenka 1 Wersja 1" },
                    new TextAsset() { TextEn = "Song 1 Version 2", TextPl = "Piosenka 1 Wersja 2" },
                    new TextAsset() { TextEn = "Song 2 Version 1", TextPl = "Piosenka 2 Wersja 1" },
                    new TextAsset() { TextEn = "Song 3 Version 1", TextPl = "Piosenka 3 Wersja 1" },
                    new TextAsset() { TextEn = "Song 1 Version 1 Text", TextPl = "Piosenka 1 Wersja 1 Tekst" },
                    new TextAsset() { TextEn = "Song 1 Version 2 Text", TextPl = "Piosenka 1 Wersja 2 Tekst" },
                    new TextAsset() { TextEn = "Song 2 Version 1 Text", TextPl = "Piosenka 2 Wersja 1 Tekst" },
                    new TextAsset() { TextEn = "Song 3 Version 1 Text", TextPl = "Piosenka 3 Wersja 1 Tekst" },
                };
                foreach (var textAsset in textAssets)
                {
                    context.TextAssets.Add(textAsset);
                }
                context.SaveChanges();

                var songVersions = new SongVersion[]
                {
                    new SongVersion() { Text = textAssets[7], VersionName = textAssets[3] },
                    new SongVersion() { Text = textAssets[8], VersionName = textAssets[4] },
                    new SongVersion() { Text = textAssets[9], VersionName = textAssets[5] },
                    new SongVersion() { Text = textAssets[10], VersionName = textAssets[6] },
                };
                foreach (var songVersion in songVersions)
                {
                    context.SongVersions.Add(songVersion);
                }
                context.SaveChanges();

                var songMetadatas = new SongMetadata[]
                {
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[0],
                        DefaultSongVersion = songVersions[0],
                        SongVersions = new SongVersion[]
                        {
                            songVersions[0], songVersions[1]
                        }
                    },
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[1],
                        DefaultSongVersion = songVersions[2],
                        SongVersions = new SongVersion[]
                        {
                            songVersions[2]
                        }
                    },
                    new SongMetadata()
                    {
                        Artist = "Unknown",
                        Title = textAssets[2],
                        DefaultSongVersion = songVersions[3],
                        SongVersions = new SongVersion[]
                        {
                            songVersions[3]
                        }
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
