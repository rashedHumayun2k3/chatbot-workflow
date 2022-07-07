/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using CooKaiApprovalWeb.Models;
using CooKaiApprovalWeb.Services;
using NLog;
using System;
using System.Threading.Tasks;
using System.Web.Http;

namespace CooKaiApprovalWeb.Controllers
{
    public class UserTokenController : ApiController
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        [Route("api/UserToken")]
        [HttpGet]
        public async Task<IHttpActionResult> GetUserTokenAsync(string upn)
        {
            try
            {
                var adalService = new AdalService(upn);                
                var result=await adalService.AquireTokenSilentAsync();
                if (result != null)
                {
                    return Ok(result.AccessToken);
                }
            }
            catch (Exception)
            {
                //Left blank intentionally
            }
            return Ok();
        }

        [Route("api/GetTokenByCode")]
        [HttpPost]
        public async Task<IHttpActionResult> GetAccessTokenFromCodeAsync(AdalAuthVM adalAuthVM)
        {
            try
            {
                var adalService = new AdalService(adalAuthVM.UserPrincipalName);
                var result =await adalService.AcquireTokenByAuthorizationCodeAsync(adalAuthVM.Code);
                if (result != null)
                {
                    return Ok(result.AccessToken);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                return InternalServerError();
            }
            return Ok();

        }        
    }
}