using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace CooKaiApprovalWeb
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.MapRoute(
                name: "Login",
                url: "login",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "SignInStart",
                url: "signinstart",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "SignInEnd",
                url: "signinend",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                       name: "Config",
                       url: "teams-config",
                       defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
                    );
            routes.MapRoute(
                       name: "CreateRequest",
                       url: "create-request",
                       defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
                    );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
