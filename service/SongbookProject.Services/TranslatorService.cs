using SongbookProject.Entities;

namespace SongbookProject.Services
{
    public class TranslatorService
    {
        public enum Languages
        {
            Pl,
            En
        }

        public static string Translate(TextAsset asset, Languages language)
        {
            if (asset == null)
            {
                return "";
            }

            switch (language)
            {
                case Languages.En:
                    return asset.TextEn;
                case Languages.Pl:
                    return asset.TextPl;
                default:
                    return asset.TextEn;
            }
        }

        public static string Translate(TextAsset asset, string language)
        {
            var parsedLanguage = ParseLanguage(language);
            return Translate(asset, parsedLanguage);
        }

        private static Languages ParseLanguage(string language)
        {
            language = language ?? "en";
            switch (language.ToLower())
            {
                case "en":
                    return Languages.En;
                case "pl":
                    return Languages.Pl;
                default:
                    return Languages.En;
            }
        }
    }
}
