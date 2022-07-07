/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using CooKaiApprovalWeb.BotAdapters;
using CooKaiApprovalWeb.Bots;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.BotFramework;
using Microsoft.Bot.Builder.Integration.AspNet.WebApi;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace CooKaiApprovalWeb.Controllers
{
    [Route("api/messages")]
    public class CookaiBotController : ApiController
    {
        private static LoggerFactory loggerFactory;
        private static IBotFrameworkHttpAdapter adapter;
       
        public CookaiBotController()
        {
            loggerFactory = new LoggerFactory();            
            var credentialProvider = new ConfigurationCredentialProvider();            
            adapter = new AdapterWithErrorHandler(credentialProvider, loggerFactory.CreateLogger<BotFrameworkHttpAdapter>());
        }
        // POST api/<controller>
        public async Task<HttpResponseMessage> Post()
        {
            var response = new HttpResponseMessage();
            var bot = new ProactiveBot(Request);
            await adapter.ProcessAsync(Request, response, bot);
            return response;
        }
    }
}