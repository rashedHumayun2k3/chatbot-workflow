/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using CooKaiApprovalWeb.DbContext;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Threading.Tasks;

namespace CooKaiApprovalWeb.BotRequestManager
{
    public class AdaptiveCardSender
    {
        public async Task SendCardToUserAsync(UserInfo senderUser, Attachment notificationCardForApprover, ApprovalRequestApproverOrViewer member)
        {
            var botCredentials = new MicrosoftAppCredentials(ConfigurationManager.AppSettings["MicrosoftAppId"], ConfigurationManager.AppSettings["MicrosoftAppPassword"]);
            var botId = new ChannelAccount(Utilities.Constants.BotAccountPrefix + botCredentials.MicrosoftAppId);

            if (member.UserInfo.TeamUserId == null) return;//the member does not have team user id, he will need to interact with bot first
            using (var connectorClient = new ConnectorClient(new Uri(senderUser.TenantInfo.BotServiceUrl), botCredentials))
            {
                var parameters = new ConversationParameters()
                {
                    IsGroup = false,
                    Bot = botId,
                    Members = new ChannelAccount[] { new ChannelAccount(member.UserInfo.TeamUserId) },
                    TenantId = senderUser.TenantInfo.TenantId.ToString(),
                };
                string coversationId = "";
                if (member.UserInfo.ConversationId == null)
                {
                    var convoResponse = await connectorClient.Conversations.CreateConversationAsync(parameters);
                    coversationId = convoResponse.Id;
                }
                else
                {
                    coversationId = member.UserInfo.ConversationId;
                }

                Activity newActivity = new Activity()
                {
                    Type = ActivityTypes.Message,
                    Conversation = new ConversationAccount
                    {
                        Id = coversationId
                    },
                };
                newActivity.Attachments = new List<Microsoft.Bot.Schema.Attachment>();
                newActivity.Attachments.Add(notificationCardForApprover);
                // Post the message to chat conversation with user
                await connectorClient.Conversations.SendToConversationAsync(newActivity);
            }
        }
    }
}