﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using songbook_project_service.Data;

namespace songbook_project_service.Migrations
{
    [DbContext(typeof(SongbookDbContext))]
    [Migration("20190808094855_InitialMigration")]
    partial class InitialMigration
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "2.2.6-servicing-10079")
                .HasAnnotation("Relational:MaxIdentifierLength", 128)
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("songbook_project_service.Context.Song", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<int?>("ArrangementId");

                    b.Property<string>("Artist");

                    b.Property<int?>("TextId");

                    b.Property<int?>("TitleId");

                    b.HasKey("Id");

                    b.HasIndex("ArrangementId");

                    b.HasIndex("TextId");

                    b.HasIndex("TitleId");

                    b.ToTable("SongMetadatas");
                });

            modelBuilder.Entity("songbook_project_service.Context.TextAsset", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("TextEn");

                    b.Property<string>("TextPl");

                    b.HasKey("Id");

                    b.ToTable("TextAssets");
                });

            modelBuilder.Entity("songbook_project_service.Context.Song", b =>
                {
                    b.HasOne("songbook_project_service.Context.TextAsset", "Arrangement")
                        .WithMany()
                        .HasForeignKey("ArrangementId");

                    b.HasOne("songbook_project_service.Context.TextAsset", "Text")
                        .WithMany()
                        .HasForeignKey("TextId");

                    b.HasOne("songbook_project_service.Context.TextAsset", "Title")
                        .WithMany()
                        .HasForeignKey("TitleId");
                });
#pragma warning restore 612, 618
        }
    }
}
