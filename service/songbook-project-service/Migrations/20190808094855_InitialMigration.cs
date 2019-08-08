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
                name: "SongMetadatas",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Artist = table.Column<string>(nullable: true),
                    TitleId = table.Column<int>(nullable: true),
                    ArrangementId = table.Column<int>(nullable: true),
                    TextId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongMetadatas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SongMetadatas_TextAssets_ArrangementId",
                        column: x => x.ArrangementId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SongMetadatas_TextAssets_TextId",
                        column: x => x.TextId,
                        principalTable: "TextAssets",
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
                name: "IX_SongMetadatas_ArrangementId",
                table: "SongMetadatas",
                column: "ArrangementId");

            migrationBuilder.CreateIndex(
                name: "IX_SongMetadatas_TextId",
                table: "SongMetadatas",
                column: "TextId");

            migrationBuilder.CreateIndex(
                name: "IX_SongMetadatas_TitleId",
                table: "SongMetadatas",
                column: "TitleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SongMetadatas");

            migrationBuilder.DropTable(
                name: "TextAssets");
        }
    }
}
