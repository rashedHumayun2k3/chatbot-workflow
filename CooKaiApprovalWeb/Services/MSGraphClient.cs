/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using Microsoft.Graph;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace CooKaiApprovalWeb.Services
{
    public class MSGraphClient
    {
        public static GraphServiceClient GetAuthenticatedClient(string accessToken)
        {
            //DelegateAuthenticationProvider provider = new DelegateAuthenticationProvider(
            //    async (requestMessage) => {                    
            //        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
            //    });

            //GraphServiceClient graphClient = new GraphServiceClient(provider);

            //return graphClient;
            var delegateAuthProvider = new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);

                return Task.FromResult(0);
            });

            var graphClient = new GraphServiceClient(delegateAuthProvider);

            return graphClient;
        }
    }
}