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
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace CooKaiApprovalWeb.BotRequestManager
{
    public class ApprovalRequestCardManager
    {
        private NotificationCardDataVM convertApprovalDataToCardData(ApprovalRequest approvalRequest)
        {
            var approvalResponse = new List<ApprovalResponseCardVM>();
            var currentApprovalLevel = approvalRequest.ApprovalLevels.FirstOrDefault(al => al.LevelNo == approvalRequest.CurrentLevel);
            var approvers = currentApprovalLevel.ApprovalRequestApproverOrViewers.Where(x => x.IsApprover == true);
            foreach (var approver in approvers)
            {
                approvalResponse.Add(new ApprovalResponseCardVM
                {
                    hasApproved = mapRequestStatusText(approver.ApprovalStatusId),
                    name = approver.UserInfo.Name,
                    statusIconUrl = mapRequestStatusIconUrl(approver.ApprovalStatusId),
                    approvalDate = approver.ResponseDate.HasValue ? approver.ResponseDate.Value.ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss'Z'") : null
                });
            }
            var attachments = new List<CardFileAttachmentInfoVM>();
            foreach (var attachment in approvalRequest.RequestAttachments)
            {
                var fileName = Path.GetExtension(attachment.FileName);
                attachments.Add(new CardFileAttachmentInfoVM
                {
                    fileUrl = HttpUtility.UrlPathEncode(attachment.BlobUrl),
                    fileName = attachment.FileName,
                    fileIconUrl = mapFileIconUrl(fileName.ToLower())
                });
            }

            var notificationCardDataVM = new NotificationCardDataVM
            {
                requestedBy = approvalRequest.UserInfo.Name,
                description = approvalRequest.Details!=null?approvalRequest.Details.Replace("\n","\n\n"):"",
                everyoneNeededText = currentApprovalLevel.IsSingleApprover ? LanguageKeyValues.ResponsesTextSingle : LanguageKeyValues.ResponsesTextMultiple,
                responded = approvers.Where(a => a.ApprovalStatusId != null).Count(),
                totalApprover = approvers.Count(),
                title = approvalRequest.Title,
                approvalResponses = approvalResponse,
                attachments = attachments,
                approvalRequestId = approvalRequest.Id,
                requestStatusIconUrl = mapRequestStatusIconUrl(approvalRequest.ApprovalStatusId),
                approveText = LanguageKeyValues.Approve,
                attachmentsText = LanguageKeyValues.Attachments,
                commentPlaceHolderText = LanguageKeyValues.CommentPlaceHolderText,
                hideDetailsText = LanguageKeyValues.HideDetails,
                outOfText = LanguageKeyValues.outOf,
                reqStatusText = mapRequestStatusText(approvalRequest.ApprovalStatusId),
                rejectText = LanguageKeyValues.Reject,
                requestedByTextForApprover = LanguageKeyValues.RequestedByTextForApprover,
                requestedByTextForViewer = LanguageKeyValues.RequestedByTextForViewer,
                requestText = LanguageKeyValues.Request,
                respondedText = LanguageKeyValues.Responded,
                showDetailsText = LanguageKeyValues.ShowDetails,
                requestApprovedOrRejectedText = $"{LanguageKeyValues.YourRequestText} {mapRequestStatusText(approvalRequest.ApprovalStatusId)}",
                commentText = LanguageKeyValues.CommentText,
                lineImageUrl = Constants.LineImageUrl,
                attachmentCount = attachments.Count,
                rejectBtnVisible = currentApprovalLevel.IsApproveOnly == true ? "false" : "true"
            };

            return notificationCardDataVM;
        }
        private string mapRequestStatusText(int? statusId)
        {
            switch (statusId)
            {
                case 1://1 pending
                    return LanguageKeyValues.Pending;

                case 2://1 approved
                    return LanguageKeyValues.Approved;

                case 3://1 rejected
                    return LanguageKeyValues.Rejected;

                default://null pending
                    return LanguageKeyValues.Pending;
            }
        }

        private string mapFileIconUrl(string extension)
        {
            switch (extension)
            {
                case ".xlsx":
                    return Constants.XlsIconUrl;

                case ".xls":
                    return Constants.XlsIconUrl;

                case ".doc":
                    return Constants.DocIconUrl;

                case ".docx":
                    return Constants.DocIconUrl;

                case ".jpg":
                    return Constants.JpgIconUrl;

                case ".pptx":
                    return Constants.PptIconUrl;

                case ".ppt":
                    return Constants.PptIconUrl;

                case ".pdf":
                    return Constants.PdfIconUrl;

                default:
                    return Constants.OtherIconUrl;
            }
        }

        private string mapRequestStatusIconUrl(int? statusId)
        {
            switch (statusId)
            {
                case 1://1 pending
                    return Constants.PendingIconUrl;

                case 2://1 approved
                    return Constants.ApprovedIconUrl;

                case 3://1 rejected
                    return Constants.RejectedIconUrl;

                default://null pending
                    return Constants.PendingIconUrl;
            }
        }

        private Attachment prepareApprovalNotificationCard(NotificationCardDataVM notificationCardData, bool isReader = false)
        {
            string adaptivecardFilePath = "";
            if (isReader == false)
            {
                adaptivecardFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/AdaptiveCards/CardJson/approval-notification-approver.json");
            }
            else
            {
                adaptivecardFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/AdaptiveCards/CardJson/approval-notification-viewer.json");
            }
            var adaptiveCardJson = File.ReadAllText(adaptivecardFilePath);
            AdaptiveCardTemplate template = new AdaptiveCardTemplate(adaptiveCardJson);
            string cardJson = template.Expand(notificationCardData);
            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = JsonConvert.DeserializeObject(cardJson),
            };

            return adaptiveCardAttachment;
        }

        private Attachment prepareApprovalNotificationCardForRequester(NotificationCardDataVM notificationCardData)
        {
            string adaptivecardFilePath = "";
            adaptivecardFilePath = System.Web.Hosting.HostingEnvironment.MapPath("~/AdaptiveCards/CardJson/approval-notification-requester.json");
            var adaptiveCardJson = File.ReadAllText(adaptivecardFilePath);
            AdaptiveCardTemplate template = new AdaptiveCardTemplate(adaptiveCardJson);
            string cardJson = template.Expand(notificationCardData);
            var adaptiveCardAttachment = new Attachment()
            {
                ContentType = "application/vnd.microsoft.card.adaptive",
                Content = JsonConvert.DeserializeObject(cardJson),
            };

            return adaptiveCardAttachment;
        }

        public async Task SendCardOnApprovalOrRejectionAsyc(ApprovalRequest approvalRequest)
        {
            using (var db = new CookaiApprovalDB())
            {
                var requestUser = approvalRequest.UserInfo;
                //if (requestUser != null && requestUser.TenantInfo != null && approvalRequest?.ApprovalStatusId>1)
                if (requestUser != null && requestUser.TenantInfo != null)
                {
                    approvalRequest = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequest.Id);//get the latest data from db
                    MicrosoftAppCredentials.TrustServiceUrl(requestUser.TenantInfo.BotServiceUrl);
                    var notificationCardData = convertApprovalDataToCardData(approvalRequest);
                    var notificationCardForRequester = prepareApprovalNotificationCardForRequester(notificationCardData);
                    var adaptiveCardSender = new AdaptiveCardSender();
                    await adaptiveCardSender.SendCardToUserAsync(requestUser, notificationCardForRequester, new ApprovalRequestApproverOrViewer { UserInfo = requestUser });
                }
            }
        }

        public async Task SendCardsToApproverOrViewerAsync(string senderUserPrincipalName, Guid approvalRequestId)
        {
            using (var db = new CookaiApprovalDB())
            {
                var senderUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == senderUserPrincipalName);
                if (senderUser != null && senderUser.TenantInfo != null)
                {
                    var approvalRequest = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestId);

                    MicrosoftAppCredentials.TrustServiceUrl(senderUser.TenantInfo.BotServiceUrl);
                    var notificationCardData = convertApprovalDataToCardData(approvalRequest);
                    var notificationCardForViewer = prepareApprovalNotificationCard(notificationCardData, true);
                    var notificationCardForApprover = prepareApprovalNotificationCard(notificationCardData);
                    var adaptiveCardSender = new AdaptiveCardSender();
                    var currentApprovalLevel = approvalRequest.ApprovalLevels.FirstOrDefault(al => al.LevelNo == approvalRequest.CurrentLevel);
                    foreach (var member in currentApprovalLevel.ApprovalRequestApproverOrViewers)
                    {
                        if (member.IsApprover)
                        {
                            await adaptiveCardSender.SendCardToUserAsync(senderUser, notificationCardForApprover, member);
                        }
                        else
                        {
                            await adaptiveCardSender.SendCardToUserAsync(senderUser, notificationCardForViewer, member);
                        }
                    }
                }
            }
        }


    }
}