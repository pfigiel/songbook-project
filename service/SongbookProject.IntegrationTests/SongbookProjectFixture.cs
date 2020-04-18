using System;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SongbookProject.API;
using SongbookProject.Model;

namespace SongbookProject.IntegrationTests
{
    public class SongbookProjectFixture : IDisposable
    {
        private  const string Url = "http://0.0.0.0:5000";
        private readonly TestServer Server;
        public HttpClient Client { get; }
        private readonly DbContextOptions<SongbookDbContext> DbContextOptions;

        protected virtual void InitializeServices(IServiceCollection services)
        {
        }

        public SongbookProjectFixture()
        {
            var configurationBuilder = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json");
            var config = configurationBuilder.Build();

            var connectionString = GetConnectionStringWithTestDatabase(config);
            DbContextOptions = new DbContextOptionsBuilder<SongbookDbContext>()
                .UseSqlServer(connectionString).Options;

            using (var db = new SongbookDbContext(DbContextOptions))
            {
                db.Database.Migrate();
            }

            var webHostBuilder = new WebHostBuilder()
                .ConfigureServices(InitializeServices)
                .UseConfiguration(config)
                .UseEnvironment("Development")
                .UseStartup(typeof(Startup));
            
            Server = new TestServer(webHostBuilder) { BaseAddress = new Uri(Url) };
            Client = Server.CreateClient();
        }

        private static string GetConnectionStringWithTestDatabase(IConfiguration config)
        {
            var connectionString = config.GetConnectionString("SongbookDevDb");
            var connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);
            connectionStringBuilder["Database"] = $"{connectionStringBuilder["Database"]}_Tests{DateTime.UtcNow.Ticks}";
            return connectionStringBuilder.ToString();
        }

        public void Dispose()
        {
            Client.Dispose();
            Server.Dispose();
            using var db = new SongbookDbContext(DbContextOptions);
            db.Database.EnsureDeleted();
        }
    }
}
