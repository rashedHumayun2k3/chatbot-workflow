/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using CooKaiApprovalWeb.BotRequestManager;
using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Services;
using CooKaiApprovalWeb.Utilities;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Newtonsoft.Json.Linq;
using NLog;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace CooKaiApprovalWeb.Bots
{
    public class ProactiveBot : TeamsActivityHandler
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        HttpRequestMessage _httpRequestMessage;
        public ProactiveBot(HttpRequestMessage httpRequestMessage)
        {
            _httpRequestMessage = httpRequestMessage;
        }
        protected override Task OnConversationUpdateActivityAsync(ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            return base.OnConversationUpdateActivityAsync(turnContext, cancellationToken);
        }

        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            string WelcomeMessage = LanguageKeyValues.BotWelcomeText;
            //saving Service Url that will be needed for bot communication later
            DbContext.TenantInfo tenantInfo;
            using (var db = new CookaiApprovalDB())
            {
                var tenantId = (Guid)turnContext.Activity.ChannelData.tenant.id;
                tenantInfo = db.TenantInfoes.FirstOrDefault(x => x.TenantId == tenantId);
                if (tenantInfo != null)
                {
                    tenantInfo.BotServiceUrl = turnContext.Activity.ServiceUrl;

                }
                else
                {
                    tenantInfo = db.TenantInfoes.Add(new DbContext.TenantInfo
                    {
                        TenantId = tenantId,
                        BotServiceUrl = turnContext.Activity.ServiceUrl,
                        Created = DateTime.UtcNow
                    });

                }
                await db.SaveChangesAsync();
                foreach (TeamsChannelAccount member in membersAdded)
                {
                    // greet anyone that was not the target (recipient) of this message.
                    if (member.Id != turnContext.Activity.Recipient.Id)
                    {
                        //save the user in database for future use
                        await saveMemberInfo(turnContext.Activity.Conversation.Id, tenantInfo.Id, db, member);
                        await turnContext.SendActivityAsync(MessageFactory.Text(WelcomeMessage), cancellationToken);
                    }
                }
            }


        }

        private static async Task saveMemberInfo(string conversationId, long tenantId, CookaiApprovalDB db, TeamsChannelAccount member)
        {
            try
            {
                var aadId = Guid.Parse(member.AadObjectId);
                UserInfo user = db.UserInfoes.FirstOrDefault(x => x.AadObjectId == aadId);
                if (user == null)//save the user to database as he is new
                {
                    user = new UserInfo
                    {
                        Id = Guid.NewGuid(),
                        AadObjectId = Guid.Parse(member.AadObjectId),
                        Created = DateTime.UtcNow,
                        Name = member.Name,
                        TeamUserId = member.Id,
                        TenantId = tenantId,
                        UserPrincipalName = member.UserPrincipalName,
                        ConversationId = conversationId
                    };

                    db.UserInfoes.Add(user);
                    //await db.SaveChangesAsync();
                }
                else
                {
                    user.TeamUserId = member.Id;
                    user.ConversationId = conversationId;
                    user.Name = member.Name;
                }
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                //throw;
            }
        }

        //protected override Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        //{
        //    //var baseUrl = _httpRequestMessage.RequestUri.GetLeftPart(UriPartial.Authority);
        //    //return Task.FromResult(new MessagingExtensionActionResponse()
        //    //{
        //    //    Task = new TaskModuleContinueResponse()
        //    //    {
        //    //        Value = new TaskModuleTaskInfo()
        //    //        {
        //    //            Height = "large",
        //    //            Width = "large",
        //    //            Title = "Create Ticket",
        //    //            Url = baseUrl + "/create-ticket?description=" + action.MessagePayload.Body.Content + "&requesterId=" + action.MessagePayload.From?.User?.Id,
        //    //        },
        //    //    },

        //    //});
        //}
        protected override Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            try
            {
                string teamAppId = ConfigurationManager.AppSettings["TeamAppId"];
                string baseUrl = ConfigurationManager.AppSettings["WebBaseUrl"];
                return Task.FromResult(new MessagingExtensionActionResponse()
                {
                    Task = new TaskModuleContinueResponse()
                    {
                        Value = new TaskModuleTaskInfo()
                        {
                            Height = 556,
                            Width = 970,
                            Title = LanguageKeyValues.CreateApprovalRequestText,
                            Url = $"{baseUrl}create-request?botCtx=true",
                        },
                    },

                });
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
        //protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionSubmitActionAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        //{
        //    await turnContext.SendActivityAsync(MessageFactory.Text("OKAY"), cancellationToken);
        //    return await base.OnTeamsMessagingExtensionSubmitActionAsync(turnContext, action, cancellationToken);
            
        //}
        //protected override async Task<TaskModuleResponse> OnTeamsTaskModuleSubmitAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest, CancellationToken cancellationToken)
        //{
        //    await turnContext.SendActivityAsync(MessageFactory.Text("OKAY"), cancellationToken);
        //    return await base.OnTeamsTaskModuleSubmitAsync(turnContext, taskModuleRequest, cancellationToken);
            
        //}
        


        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            try
            {
                var resultMessage = "あなたのメッセージはどのコマンドとも一致しませんでした";//Your message did not match with any command.
                if (!string.IsNullOrEmpty(turnContext.Activity.Text))
                {
                    if (turnContext.Activity.Text.ToLower() == "approval" || turnContext.Activity.Text == "承認")
                    {
                        ApprovalStatusCardManager approvalStatusCardManager = new ApprovalStatusCardManager();
                        var resultCard = approvalStatusCardManager.GetCardOnApprovalText(Guid.Parse(turnContext.Activity.From.AadObjectId));
                        if (resultCard != null)
                        {
                            await turnContext.SendActivityAsync(MessageFactory.Attachment(resultCard), cancellationToken);
                            return;
                        }
                    }
                }
                using (CookaiApprovalDB db = new CookaiApprovalDB())
                {
                    var tenantId = (Guid)turnContext.Activity.ChannelData.tenant.id;
                    var tenantInfo = db.TenantInfoes.FirstOrDefault(x => x.TenantId == tenantId);
                    var member = await TeamsInfo.GetMemberAsync(turnContext, turnContext.Activity.From.Id, cancellationToken);
                    if (tenantInfo != null)
                    {
                        await saveMemberInfo(turnContext.Activity.Conversation.Id, tenantInfo.Id, db, member);

                    }
                    else
                    {
                        tenantInfo = db.TenantInfoes.Add(new DbContext.TenantInfo
                        {
                            TenantId = tenantId,
                            BotServiceUrl = turnContext.Activity.ServiceUrl,
                            Created = DateTime.UtcNow
                        });
                        await db.SaveChangesAsync();

                        await saveMemberInfo(turnContext.Activity.Conversation.Id, tenantInfo.Id, db, member);
                    }
                    if (turnContext.Activity.Value != null)//accept/reject button pressed
                    {
                        var postedObject = turnContext.Activity.Value as JObject;
                        var approvalRequestId = Guid.Parse(postedObject.GetValue("id").ToString());
                        var comment = postedObject.GetValue("txtComment").ToString();
                        var isForApproval = postedObject.GetValue("action").ToString() == "approve" ? true : false;
                        var memberAADObjectId = Guid.Parse(member.AadObjectId);
                        ApprovalRequestProcessor approvalRequestProcessor = new ApprovalRequestProcessor();
                        var result =await approvalRequestProcessor.ApproveOrRejectAsync(approvalRequestId, memberAADObjectId, comment, isForApproval, db);
                        resultMessage = result.Message;

                    }
                }
                await turnContext.SendActivityAsync(MessageFactory.Text(resultMessage), cancellationToken);
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
    }
}