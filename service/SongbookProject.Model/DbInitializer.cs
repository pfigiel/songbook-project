using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using SongbookProject.Entities;
using SongbookProject.Utils;
using System.Linq;
using System.Threading.Tasks;

namespace SongbookProject.Data
{
    public class DbInitializer : IDbInitializer
    {
        private readonly SongbookDbContext context;
        private readonly SongbookIdentityDbContext identityContext;
        private readonly UserManager<IdentityUser> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly InitialAdminCredentials adminCredentials;

        public DbInitializer(
            SongbookDbContext context,
            SongbookIdentityDbContext identityContext,
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IOptions<InitialAdminCredentials> adminCredentialOptions)
        {
            this.context = context;
            this.identityContext = identityContext;
            this.userManager = userManager;
            this.roleManager = roleManager;
            adminCredentials = adminCredentialOptions.Value;
        }

        public async Task EnsurePopulated(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                context.Database.Migrate();
                Initialize();
                context.Database.CloseConnection();

                identityContext.Database.Migrate();
                await InitializeIdentityAsync();
                identityContext.Database.CloseConnection();
            }
        }

        private void Initialize()
        {
            // Some of the collections are empty, some are not - unexpected situation, clear collections
            //if (context.Songs.Any() ^ context.TextAssets.Any())
            //{
            //    foreach (var songMetadata in context.Songs)
            //    {
            //        context.Songs.Remove(songMetadata);
            //    }
            //    foreach (var textAsset in context.TextAssets)
            //    {
            //        context.TextAssets.Remove(textAsset);
            //    }
            //    context.SaveChanges();
            //}

            // All collections are empty - populate
            if (!context.Songs.Any() && !context.TextAssets.Any())
            {
                //var textAssets = new TextAsset[]
                //{
                //    new TextAsset() { TextPl = "Piosenka 1" },
                //    new TextAsset() { TextEn = "Song 2", TextPl = "Piosenka 2" },
                //    new TextAsset() { TextEn = "Song 3" },
                //    new TextAsset() { TextEn = "Song 1 Text", TextPl = "Piosenka 1 Tekst" },
                //    new TextAsset() { TextEn = "Song 2 Text", TextPl = "Piosenka 2 Tekst" },
                //    new TextAsset() { TextEn = "Song 3 Text", TextPl = "Piosenka 3 Tekst" },
                //    new TextAsset() { TextEn = "Song 2 Arrangement" },
                //    new TextAsset() { TextPl = "Aranżacja Piosenki 1" },
                //};
                //foreach (var textAsset in textAssets)
                //{
                //    context.TextAssets.Add(textAsset);
                //}
                //context.SaveChanges();

                //var songMetadatas = new Song[]
                //{
                //    new Song()
                //    {
                //        Artist = "Unknown",
                //        Title = textAssets[0],
                //        Text = textAssets[3],
                //        Arrangement = textAssets[7]
                //    },
                //    new Song()
                //    {
                //        Artist = "Unknown",
                //        Title = textAssets[1],
                //        Text = textAssets[4],
                //        Arrangement = textAssets[6]
                //    },
                //    new Song()
                //    {
                //        Artist = "Unknown",
                //        Title = textAssets[2],
                //        Text = textAssets[5]
                //    }
                //};
                //foreach (var songMetadata in songMetadatas)
                //{
                //    context.Songs.Add(songMetadata);
                //}
                //context.SaveChanges();
            }
        }

        private async Task InitializeIdentityAsync()
        {
            if (!identityContext.Roles.Any())
            {
                var adminRole = new IdentityRole { Name = RoleNames.Admin };
                var defaultRole = new IdentityRole { Name = RoleNames.Default };
                await roleManager.CreateAsync(adminRole);
                await roleManager.CreateAsync(defaultRole);
                //identityContext.Roles.Add(adminRole);
                //identityContext.Roles.Add(defaultRole);
            }

            if (!identityContext.Users.Any())
            {
                var user = new IdentityUser()
                {
                    UserName = adminCredentials.UserName,
                    Email = adminCredentials.Email,
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(user, adminCredentials.Password);
                await userManager.AddToRoleAsync(user, RoleNames.Admin);
                identityContext.Users.Add(user);
            }
        }
    }
}
