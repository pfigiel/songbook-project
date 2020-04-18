using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using SongbookProject.API;
using Xunit;

namespace SongbookProject.IntegrationTests
{
    [Collection(SongbookProjectTests.Name)]
    public class SongsTests
    {
        private readonly SongbookProjectFixture fixture;

        public SongsTests(SongbookProjectFixture fixture)
        {
            this.fixture = fixture;
        }
        
        [Fact]
        public async Task Get_Songs()
        {
            var songs = await fixture.Client.GetAsync("songs");
            Assert.True(songs.IsSuccessStatusCode);
        }
    }
}
