using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;

namespace CooKaiApprovalWeb.CustomAttributes
{
    public class JWTMixAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool IsAuthorized(HttpActionContext actionContext)
        {
            try
            {
                if (actionContext.Request.Headers.Authorization != null)
                {
                    var stream = actionContext.Request.Headers.Authorization.Parameter;
                    //var res = ValidateToken(stream);
                    var handler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
                    var jsonToken = handler.ReadToken(stream);
                    var tokenJWT = handler.ReadToken(stream) as System.IdentityModel.Tokens.Jwt.JwtSecurityToken;
                    if (tokenJWT.ValidTo > DateTime.UtcNow && tokenJWT.Payload["aud"].ToString() == "https://graph.microsoft.com/")
                    {
                        HttpContext.Current.User = new System.Security.Principal.GenericPrincipal(
                            new System.Security.Principal.GenericIdentity(tokenJWT.Payload["upn"].ToString()),
                            new string[] {
                                /* fill roles if any */
                            });
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch (Exception)
            {
                //failed, so use default authorization
                //throw;
            }
            var isAuthorized = base.IsAuthorized(actionContext);
            return isAuthorized;
        }

    }
}