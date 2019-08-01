using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace songbook_project_service.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TextAssets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TextEn = table.Column<string>(nullable: true),
                    TextPl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextAssets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SongVersions",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    VersionNameId = table.Column<int>(nullable: true),
                    TextId = table.Column<int>(nullable: true),
                    SongMetadataId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongVersions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SongVersions_TextAssets_TextId",
                        column: x => x.TextId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SongVersions_TextAssets_VersionNameId",
                        column: x => x.VersionNameId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SongMetadatas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    TitleId = table.Column<int>(nullable: true),
                    Artist = table.Column<string>(nullable: true),
                    DefaultSongVersionId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongMetadatas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SongMetadatas_SongVersions_DefaultSongVersionId",
                        column: x => x.DefaultSongVersionId,
                        principalTable: "SongVersions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SongMetadatas_TextAssets_TitleId",
                        column: x => x.TitleId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SongMetadatas_DefaultSongVersionId",
                table: "SongMetadatas",
                column: "DefaultSongVersionId");

            migrationBuilder.CreateIndex(
                name: "IX_SongMetadatas_TitleId",
                table: "SongMetadatas",
                column: "TitleId");

            migrationBuilder.CreateIndex(
                name: "IX_SongVersions_SongMetadataId",
                table: "SongVersions",
                column: "SongMetadataId");

            migrationBuilder.CreateIndex(
                name: "IX_SongVersions_TextId",
                table: "SongVersions",
                column: "TextId");

            migrationBuilder.CreateIndex(
                name: "IX_SongVersions_VersionNameId",
                table: "SongVersions",
                column: "VersionNameId");

            migrationBuilder.AddForeignKey(
                name: "FK_SongVersions_SongMetadatas_SongMetadataId",
                table: "SongVersions",
                column: "SongMetadataId",
                principalTable: "SongMetadatas",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SongMetadatas_SongVersions_DefaultSongVersionId",
                table: "SongMetadatas");

            migrationBuilder.DropTable(
                name: "SongVersions");

            migrationBuilder.DropTable(
                name: "SongMetadatas");

            migrationBuilder.DropTable(
                name: "TextAssets");
        }
    }
}
