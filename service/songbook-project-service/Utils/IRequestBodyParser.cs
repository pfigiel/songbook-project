﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service.Utils
{
    public interface IRequestBodyParser
    {
        T Parse<T>(HttpRequest request);
    }
}
