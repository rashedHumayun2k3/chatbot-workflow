/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using CooKaiApprovalWeb.BotRequestManager;
using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Models;
using CooKaiApprovalWeb.Utilities;
using NLog;
using System;
using System.Linq;

namespace CooKaiApprovalWeb.Services
{
    public class ApprovalRequestProcessor
    {
        private static Logger logger = LogManager.GetCurrentClassLogger();
        public async System.Threading.Tasks.Task<ApproveOrRejectResult> ApproveOrRejectAsync(Guid approvalRequestId, Guid memberAADObjectId, string comment, bool isForApprove, CookaiApprovalDB db)
        {
            ApprovalRequest approvalRequest = null;
            string actionResult = "";
            try
            {
                var user = db.UserInfoes.FirstOrDefault(m => m.AadObjectId == memberAADObjectId);
                if (user != null)
                {
                    approvalRequest = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestId &&
                    (ar.ApprovalStatusId == null || ar.ApprovalStatusId == Constants.PendingApprovalStatusId));
                    if (approvalRequest != null)
                    {

                        var approvalRequestApproverOrViewer = approvalRequest.ApprovalLevels.FirstOrDefault(al => al.LevelNo == approvalRequest.CurrentLevel).ApprovalRequestApproverOrViewers.FirstOrDefault(arav => arav.UserId == user.Id
                            && (arav.ApprovalStatusId == null || arav.ApprovalStatusId == Constants.PendingApprovalStatusId) && arav.IsApprover == true);

                        if (approvalRequestApproverOrViewer != null)
                        {
                            approvalRequestApproverOrViewer.Comment = comment;
                            approvalRequestApproverOrViewer.ResponseDate = DateTime.UtcNow;
                            if (isForApprove)//approved
                            {
                                //var approvalStatusForApproved = db.ApprovalStatus.FirstOrDefault(a => a.Name == LanguageKeyValues.Approved);
                                approvalRequestApproverOrViewer.ApprovalStatusId = Constants.ApprovedApprovalStatusId;
                                await ApproveOrRejectMainObjectAsync(approvalRequest, Constants.ApprovedApprovalStatusId, db);

                            }
                            else//rejected
                            {
                                //var approvalStatusForRejected = db.ApprovalStatus.FirstOrDefault(a => a.Name == LanguageKeyValues.Rejected);
                                approvalRequestApproverOrViewer.ApprovalStatusId = Constants.RejectedApprovalStatusId;
                                await ApproveOrRejectMainObjectAsync(approvalRequest, Constants.RejectedApprovalStatusId, db);
                            }
                            db.SaveChanges();
                            actionResult = LanguageKeyValues.RequestProcessed;

                            return new ApproveOrRejectResult { ApprovalRequest = approvalRequest, Message = actionResult };
                        }
                        else
                        {
                            actionResult = LanguageKeyValues.RequestAlreadyApprovedOrRejected;
                        }

                    }
                    else
                    {
                        actionResult = LanguageKeyValues.RequestAlreadyApprovedOrRejected;
                    }

                }
                else
                {
                    actionResult = LanguageKeyValues.UserNotFound;
                }

            }
            catch (Exception ex)
            {
                logger.Error(ex);
                //actionResult = ex.Message;//TODO remove when in production with error message (generic)
                actionResult = LanguageKeyValues.GenericError;
                return new ApproveOrRejectResult { ApprovalRequest = approvalRequest, Message = actionResult };

            }
            return new ApproveOrRejectResult { ApprovalRequest = approvalRequest, Message = actionResult };
        }

        private static async System.Threading.Tasks.Task ApproveOrRejectMainObjectAsync(ApprovalRequest approvalRequest, int approvalStatusId, CookaiApprovalDB db)
        {

            var utcNow = DateTime.UtcNow;
            //if isSingleApproval is true
            //then if one "Approves" it will approved
            //or if all rejects then it will be rejected

            //if isSingleApproval is false
            //then if all approves it will be approved
            //or if one rejects it will be rejected

            var currentApprovalLevel = approvalRequest.ApprovalLevels.FirstOrDefault(al => al.LevelNo == approvalRequest.CurrentLevel);

            var approvalRequestApproverOrViewers = currentApprovalLevel.ApprovalRequestApproverOrViewers.
                      Where(arav => arav.IsApprover == true && (arav.ApprovalStatusId == null || arav.ApprovalStatusId == Constants.PendingApprovalStatusId));
            try
            {
                //if (approvalRequestApproverOrViewers != null && approvalRequestApproverOrViewers.Any()) //this if check is not working that is why added try catch
                {
                    ApprovalRequestCardManager approvalRequestCardManager = new ApprovalRequestCardManager();
                    int remainingApprover = approvalRequestApproverOrViewers.Count();


                    if (currentApprovalLevel.IsSingleApprover)
                    {
                        if (approvalStatusId == Constants.ApprovedApprovalStatusId)
                        {

                            if (approvalRequest.CurrentLevel == approvalRequest.TotalLevel)//approve/reject main object
                            {
                                approvalRequest.ResponseDate = utcNow;
                                approvalRequest.ApprovalStatusId = approvalStatusId;
                                currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                                currentApprovalLevel.ResponseDate = utcNow;
                                //send requester that request is approved or rejected finally
                                db.SaveChanges();
                                await approvalRequestCardManager.SendCardOnApprovalOrRejectionAsyc(approvalRequest);
                                return;

                            }
                            approvalRequest.CurrentLevel = approvalRequest.CurrentLevel + 1;
                            currentApprovalLevel.ResponseDate = utcNow;
                            currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                            db.SaveChanges();
                            //Send notifications to next level approver/viewers
                            await approvalRequestCardManager.SendCardsToApproverOrViewerAsync(approvalRequest.UserInfo.UserPrincipalName, approvalRequest.Id);
                            return;
                        }
                        else if (approvalStatusId == Constants.RejectedApprovalStatusId)//this is new reject rule for isSingleApproval is true, if anyone rejects, it will be rejected 28th June, 2021
                        {
                            currentApprovalLevel.ResponseDate = utcNow;
                            currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                            approvalRequest.ResponseDate = utcNow;
                            approvalRequest.ApprovalStatusId = approvalStatusId;
                            db.SaveChanges();
                            //send requester that request is approved or rejected finally
                            await approvalRequestCardManager.SendCardOnApprovalOrRejectionAsyc(approvalRequest);
                            return;
                        }
                    }
                    else
                    {
                        if (approvalStatusId == Constants.RejectedApprovalStatusId)
                        {
                            currentApprovalLevel.ResponseDate = utcNow;
                            currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                            approvalRequest.ResponseDate = utcNow;
                            approvalRequest.ApprovalStatusId = approvalStatusId;
                            db.SaveChanges();
                            //send requester that request is approved or rejected finally
                            await approvalRequestCardManager.SendCardOnApprovalOrRejectionAsyc(approvalRequest);
                            return;
                        }
                    }
                    if (remainingApprover == 0)
                    {
                        //if the status is rejected for current level, it should be rejected entirely
                        if (approvalStatusId == Constants.RejectedApprovalStatusId)
                        {
                            approvalRequest.ResponseDate = utcNow;
                            approvalRequest.ApprovalStatusId = approvalStatusId;
                            currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                            db.SaveChanges();
                            //send requester that request is approved or rejected finally
                            await approvalRequestCardManager.SendCardOnApprovalOrRejectionAsyc(approvalRequest);
                            return;
                        }


                        currentApprovalLevel.ResponseDate = utcNow;
                        currentApprovalLevel.ApprovalStatusId = approvalStatusId;
                        if (approvalRequest.CurrentLevel == approvalRequest.TotalLevel)//approve/reject main object
                        {
                            approvalRequest.ResponseDate = utcNow;
                            approvalRequest.ApprovalStatusId = approvalStatusId;
                            db.SaveChanges();
                            //send requester that request is approved or rejected finally
                            await approvalRequestCardManager.SendCardOnApprovalOrRejectionAsyc(approvalRequest);

                            return;
                        }
                        approvalRequest.CurrentLevel = approvalRequest.CurrentLevel + 1;
                        db.SaveChanges();
                        //Send notifications to next level approver/viewers
                        await approvalRequestCardManager.SendCardsToApproverOrViewerAsync(approvalRequest.UserInfo.UserPrincipalName, approvalRequest.Id);

                    }

                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
            }
        }

    }
}