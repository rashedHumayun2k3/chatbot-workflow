using NLog;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Filters;

namespace CooKaiApprovalWeb.CustomAttributes
{
    public class ExceptionHandlingAttribute : ExceptionFilterAttribute
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public override void OnException(HttpActionExecutedContext context)
        {
            logger.Error(context.Exception);
            throw new HttpResponseException(new HttpResponseMessage(HttpStatusCode.InternalServerError)
            {
                Content = new StringContent("An error occurred."),
                ReasonPhrase = "Critical Exception"
            });
        }
    }
}