using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace songbook_project_service
{
    public class BlacklistJWTRequirement : AuthorizationHandler<BlacklistJWTRequirement>, IAuthorizationRequirement
    {
        public override Task HandleAsync(AuthorizationHandlerContext context)
        {
            context.
            return base.HandleAsync(context);
        }
    }
}
