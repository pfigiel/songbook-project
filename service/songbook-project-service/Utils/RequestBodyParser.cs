using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Utils
{
    public class RequestBodyParser : IRequestBodyParser
    {
        private readonly ILogger logger;

        public RequestBodyParser(ILogger<Mailer> logger)
        {
            this.logger = logger;
        }

        public T Parse<T>(HttpRequest request)
        {
            try
            {
                using (var reader = new StreamReader(request.Body))
                {
                    var body = reader.ReadToEnd();
                    var parsedBody = JObject.Parse(body).ToString();
                    return JsonConvert.DeserializeObject<T>(parsedBody);
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message);
                return default;
            }
        }
    }
}
