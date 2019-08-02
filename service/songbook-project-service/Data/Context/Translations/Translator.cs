using songbook_project_service.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Data.Context.Translations
{
    public class Translator
    {
        public enum Languages
        {
            Pl,
            En
        }

        public static string Translate(TextAsset asset, Languages language)
        {
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
