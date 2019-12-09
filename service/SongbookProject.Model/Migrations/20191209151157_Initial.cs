using Microsoft.EntityFrameworkCore.Migrations;

namespace SongbookProject.Model.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TextAssets",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TextEn = table.Column<string>(nullable: true),
                    TextPl = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TextAssets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Songs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Artist = table.Column<string>(nullable: true),
                    TitleId = table.Column<int>(nullable: true),
                    ArrangementId = table.Column<int>(nullable: true),
                    TextId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Songs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Songs_TextAssets_ArrangementId",
                        column: x => x.ArrangementId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Songs_TextAssets_TextId",
                        column: x => x.TextId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Songs_TextAssets_TitleId",
                        column: x => x.TitleId,
                        principalTable: "TextAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Songs_ArrangementId",
                table: "Songs",
                column: "ArrangementId");

            migrationBuilder.CreateIndex(
                name: "IX_Songs_TextId",
                table: "Songs",
                column: "TextId");

            migrationBuilder.CreateIndex(
                name: "IX_Songs_TitleId",
                table: "Songs",
                column: "TitleId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Songs");

            migrationBuilder.DropTable(
                name: "TextAssets");
        }
    }
}
