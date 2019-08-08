using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using songbook_project_service.Context;
using songbook_project_service.Data.IdentityContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data
{
    public static class DbInitializer
    {
        public static void EnsurePopulated(IApplicationBuilder app, IConfiguration configuration)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = (SongbookDbContext)serviceScope.ServiceProvider.GetService(typeof(SongbookDbContext));
                context.Database.Migrate();
                Initialize(context);
                context.Database.CloseConnection();

                var identityContext = (SongbookIdentityDbContext)serviceScope.ServiceProvider.GetService(typeof(SongbookIdentityDbContext));
                var roleManager = (RoleManager<IdentityRole>)serviceScope.ServiceProvider.GetService(typeof(RoleManager<IdentityRole>));
                var userManager = (UserManager<IdentityUser>)serviceScope.ServiceProvider.GetService(typeof(UserManager<IdentityUser>));
                identityContext.Database.Migrate();
                InitializeIdentity(identityContext, roleManager, userManager, configuration);
            }
        }

        private static void Initialize(SongbookDbContext context)
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
                    new TextAsset() { TextPl = "Piosenka 1" },
                    new TextAsset() { TextEn = "Song 2", TextPl = "Piosenka 2" },
                    new TextAsset() { TextEn = "Song 3" },
                    new TextAsset() { TextEn = "Song 1 Text", TextPl = "Piosenka 1 Tekst" },
                    new TextAsset() { TextEn = "Song 2 Text", TextPl = "Piosenka 2 Tekst" },
                    new TextAsset() { TextEn = "Song 3 Text", TextPl = "Piosenka 3 Tekst" },
                    new TextAsset() { TextEn = "Song 2 Arrangement" },
                    new TextAsset() { TextPl = "Aranżacja Piosenki 1" },
                };
                foreach (var textAsset in textAssets)
                {
                    context.TextAssets.Add(textAsset);
                }
                context.SaveChanges();

                var songMetadatas = new Song[]
                {
                    new Song()
                    {
                        Artist = "Unknown",
                        Title = textAssets[0],
                        Text = textAssets[3],
                        Arrangement = textAssets[7]
                    },
                    new Song()
                    {
                        Artist = "Unknown",
                        Title = textAssets[1],
                        Text = textAssets[4],
                        Arrangement = textAssets[6]
                    },
                    new Song()
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

        private static void InitializeIdentity(
            SongbookIdentityDbContext context,
            RoleManager<IdentityRole> roleManager,
            UserManager<IdentityUser> userManager,
            IConfiguration configuration)
        {
            context.Database.EnsureCreated();

            if (!context.Roles.Any())
            {
                var adminRole = new IdentityRole
                {
                    Name = RoleNames.Admin
                };
                var defaultRole = new IdentityRole
                {
                    Name = RoleNames.Default
                };
                roleManager.CreateAsync(adminRole);
                roleManager.CreateAsync(defaultRole);
                context.Roles.Add(adminRole);
                context.Roles.Add(defaultRole);
            }

            if (!context.Users.Any())
            {
                var user = new IdentityUser()
                {
                    UserName = configuration.GetValue<string>("InitialAdminCredentials:UserName"),
                    Email = configuration.GetValue<string>("InitialAdminCredentials:Email"),
                };
                userManager.CreateAsync(user, configuration.GetValue<string>("InitialAdminCredentials:Password")).Wait();
                userManager.AddToRoleAsync(user, RoleNames.Admin).Wait();
                context.Users.Add(user);
            }
        }
    }
}
