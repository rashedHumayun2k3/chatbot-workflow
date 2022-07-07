/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Configuration;
using System.Threading.Tasks;

namespace CooKaiApprovalWeb.Services
{
    public class AdalService
    {
        static string _authority = "https://login.windows.net/common";
        static string _resourceUrl = "https://graph.microsoft.com/";
        AuthenticationResult _authResult = null;
        AuthenticationContext _authContext;


        private ADALDbTokenCache adalDbTokenCache;
        public AdalService(string userPrincipalName)
        {
            adalDbTokenCache = new ADALDbTokenCache(userPrincipalName);
            _authContext = new AuthenticationContext(_authority, false, adalDbTokenCache);
        }
        

        public async Task<AuthenticationResult> AcquireTokenByAuthorizationCodeAsync(string code)
        {            
            string redirectUrl = ConfigurationManager.AppSettings["ADRedirectUrl"];
            ClientCredential clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ADClientID"], ConfigurationManager.AppSettings["ADClientSecret"]);
            AuthenticationResult result =await _authContext.AcquireTokenByAuthorizationCodeAsync(code, new Uri(redirectUrl), clientCredential, _resourceUrl);
            return result;
        }
        //public AuthenticationResult AquireAccessToken()
        //{
        //    ClientCredential clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ADClientID"], ConfigurationManager.AppSettings["ADClientSecret"]);
            
        //    return _authContext.AcquireTokenAsync(_resourceUrl, clientCredential).Result;
        //}
        public async Task<AuthenticationResult> AquireTokenSilentAsync()
        {
            try
            {
                ClientCredential clientCredential = new ClientCredential(ConfigurationManager.AppSettings["ADClientID"], ConfigurationManager.AppSettings["ADClientSecret"]);
                return await _authContext.AcquireTokenSilentAsync(_resourceUrl, clientCredential, UserIdentifier.AnyUser);
            }
            catch (Exception ex)
            {
                //Refresh token expired, need to login
                return null;
            }
        }

       
    }
}