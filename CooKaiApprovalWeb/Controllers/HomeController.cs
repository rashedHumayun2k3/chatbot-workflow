/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using System.Web.Mvc;

namespace CooKaiApprovalWeb.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            
            return File(Server.MapPath("/") + "index.html", "text/html");
        }


    }
}