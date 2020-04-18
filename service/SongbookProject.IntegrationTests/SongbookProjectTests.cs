using Xunit;

namespace SongbookProject.IntegrationTests
{
    [CollectionDefinition(Name)]
    public class SongbookProjectTests : ICollectionFixture<SongbookProjectFixture>
    {
        public const string Name = "SongbookProjectIntegrationTests";
    }
}
