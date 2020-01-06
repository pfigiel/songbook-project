using Microsoft.EntityFrameworkCore.Migrations;

namespace SongbookProject.Model.Migrations
{
    public partial class RemovedSongsTranslations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_TextAssets_ArrangementId",
                table: "Songs");

            migrationBuilder.DropForeignKey(
                name: "FK_Songs_TextAssets_TextId",
                table: "Songs");

            migrationBuilder.DropForeignKey(
                name: "FK_Songs_TextAssets_TitleId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_ArrangementId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_TextId",
                table: "Songs");

            migrationBuilder.DropIndex(
                name: "IX_Songs_TitleId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "ArrangementId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "TextId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "TitleId",
                table: "Songs");

            migrationBuilder.AddColumn<string>(
                name: "Arrangement",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LanguageId",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalTitle",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Text",
                table: "Songs",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Title",
                table: "Songs",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Languages",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Code = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Languages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Songs_LanguageId",
                table: "Songs",
                column: "LanguageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_Languages_LanguageId",
                table: "Songs",
                column: "LanguageId",
                principalTable: "Languages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Songs_Languages_LanguageId",
                table: "Songs");

            migrationBuilder.DropTable(
                name: "Languages");

            migrationBuilder.DropIndex(
                name: "IX_Songs_LanguageId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Arrangement",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "LanguageId",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "OriginalTitle",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Text",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Title",
                table: "Songs");

            migrationBuilder.AddColumn<int>(
                name: "ArrangementId",
                table: "Songs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TextId",
                table: "Songs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TitleId",
                table: "Songs",
                type: "int",
                nullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_TextAssets_ArrangementId",
                table: "Songs",
                column: "ArrangementId",
                principalTable: "TextAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_TextAssets_TextId",
                table: "Songs",
                column: "TextId",
                principalTable: "TextAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Songs_TextAssets_TitleId",
                table: "Songs",
                column: "TitleId",
                principalTable: "TextAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
