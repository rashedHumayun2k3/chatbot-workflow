/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using AdaptiveCards.Templating;
using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Models;
using CooKaiApprovalWeb.Utilities;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.IO;
using System.Linq;

namespace CooKaiApprovalWeb.BotRequestManager
{
    public class ApprovalStatusCardManager
    {
        public Attachment GetCardOnApprovalText(Guid senderAadObjectId)
        {
            using (var db = new CookaiApprovalDB())
            {
                var requestUser = db.UserInfoes.FirstOrDefault(u => u.AadObjectId == senderAadObjectId);
                //if (requestUser != null && requestUser.TenantInfo != null && approvalRequest?.ApprovalStatusId>1)
                if (requestUser != null && requestUser.TenantInfo != null)
                {
                    var countOfPendingRequest = db.ApprovalRequests.Count(ar => ar.RequesterUserId == requestUser.Id && ar.ApprovalStatusId==null);
                    var countOfPendingForApprover =  db.ApprovalRequestApproverOrViewers.Count(arv => arv.UserId == requestUser.Id && arv.ApprovalStatusId == null && arv.IsApprover==true);
                    MicrosoftAppCredentials.TrustServiceUrl(requestUser.TenantInfo.BotServiceUrl);
                    string teamAppId = ConfigurationManager.AppSettings["TeamAppId"];
                    string baseUrl= ConfigurationManager.AppSettings["WebBaseUrl"];
                    var approvalStatusCardData = new ApprovalStatusCardDataVM {
                        titleText= LanguageKeyValues.YouApprovalStatusText,
                        bodyText= string.Format(LanguageKeyValues.ApprovalStatusCardBodyText, countOfPendingRequest, countOfPendingForApprover),
                        createApprovalRequestText= LanguageKeyValues.CreateApprovalRequestText,
                        createApprovalUrl= $"https://teams.microsoft.com/l/task/{teamAppId}?url={Uri.EscapeDataString(baseUrl+ "create-request?botCtx=true")}&height=556px&width=970px",
                        viewRequestsText= LanguageKeyValues.ViewApprovalRequestsText,
                        viewRequestsUrl= $"https://teams.microsoft.com/l/entity/{teamAppId}/CookaiDashboard?&label=Go",
                    };
                    var approvalCard = prepareApprovalStatusCard(approvalStatusCardData);
                    return approvalCard;
                    //var adaptiveCardSender = new AdaptiveCardSender();
                    //await adaptiveCardSender.SendCardToUserAsync(requestUser, approvalCard, new ApprovalRequestApproverOrViewer { UserInfo = requestUser });
                }
                return null;
            }
        }
        private Attachment prepareApprovalStatusCard(ApprovalStatusCardDataVM approvalStatusCardData)
        {
            string adaptivecardFilePath = "";
            adaptivecardFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/AdaptiveCards/CardJson/approval-status.json");
            var adaptiveCardJson = File.ReadAllText(adaptivecardFilePath);
            AdaptiveCardTemplate template = new AdaptiveCardTemplate(adaptiveCardJson);
            string cardJson = template.Expand(approvalStatusCardData);
            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = JsonConvert.DeserializeObject(cardJson),
            };

            return adaptiveCardAttachment;
        }
    }
}