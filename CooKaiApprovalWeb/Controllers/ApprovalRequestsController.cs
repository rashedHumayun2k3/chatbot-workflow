/*
 Developed by iXora Solution Ltd.
 Developer: Munshi H M Rayhan
 Last Modified: 25/8/2020
 */
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using CooKaiApprovalWeb.BotRequestManager;
using CooKaiApprovalWeb.CustomAttributes;
using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Models;
using CooKaiApprovalWeb.Services;
using CooKaiApprovalWeb.Utilities;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Newtonsoft.Json;
using NLog;
using Constants = CooKaiApprovalWeb.Utilities.Constants;

namespace CooKaiApprovalWeb.Controllers
{
    [RoutePrefix("api/ApprovalRequests")]
    [JWTMixAuthorize]
    public class ApprovalRequestsController : ApiController
    {
        private CookaiApprovalDB db = new CookaiApprovalDB();
        private static Logger logger = LogManager.GetCurrentClassLogger();

        [HttpGet]
        [Route("GetDashboardStats")]
        public IHttpActionResult GetDashboardStats(string userPrincipal)
        {
            int pendingApprovalStatusId = Utilities.Constants.PendingApprovalStatusId;
            int approvedApprovalStatusId = Utilities.Constants.ApprovedApprovalStatusId;
            int rejectedApprovalStatusId = Utilities.Constants.RejectedApprovalStatusId;
            var userInfo = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);

            if (userInfo == null)
                return NotFound();
            var approvalRequestsInDbAsRequester = db.ApprovalRequests.
                Where(ar => ar.RequesterUserId == userInfo.Id);

            int totalRequestedAsRequester = approvalRequestsInDbAsRequester.Count();
            int awaitingForRequester = approvalRequestsInDbAsRequester.Where(ar => ar.ApprovalStatusId == null || ar.ApprovalStatusId == pendingApprovalStatusId).Count();
            int approvedForRequester = approvalRequestsInDbAsRequester.Where(ar => ar.ApprovalStatusId == approvedApprovalStatusId).Count();
            int rejectedForRequester = approvalRequestsInDbAsRequester.Where(ar => ar.ApprovalStatusId == rejectedApprovalStatusId).Count();
            decimal averageApprovedForRequester = 0;
            if (totalRequestedAsRequester > 0 && approvedForRequester > 0)
            {
                //“Average Number of days”= (“The time Request to Approval”　 -“The daysRequest to Approval” *“The time not towork: static 15hours”) / “The time to work: static 9 hours”
                var sqlToCalculateAverage = "SELECT ISNULL(Avg(((DATEDIFF(HOUR,RequestedDate,ResponseDate)-(DATEDIFF(DAY,RequestedDate,ResponseDate))*15.0))/9.0),0) " +
                    "FROM [dbo].[ApprovalRequests] WHERE [ApprovalStatusId]=" + approvedApprovalStatusId + " AND RequesterUserId='" + userInfo.Id + "'";
                averageApprovedForRequester = db.Database.SqlQuery<decimal>(sqlToCalculateAverage).First();
            }
            int totalRequestedToApprover = 0;
            int awaitingForApprover = 0;
            int answeredByApprover = 0;
            //var approvalLevelsAsApprover = db.ApprovalLevels.Where(al => al.LevelNo <= al.ApprovalRequest.CurrentLevel
            //&& al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true));
            //totalRequestedToApprover = approvalLevelsAsApprover.Count();

            var approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true) && al.LevelNo <= ar.CurrentLevel));
            totalRequestedToApprover = approvalRequestsInDB.Count();
            //awaitingForApprover = approvalLevelsAsApprover.Where(ar => ar.ApprovalRequestApproverOrViewers.Any(arav => (arav.ApprovalStatusId == null || arav.ApprovalStatusId == pendingApprovalStatusId))).Count();

            var answeredReqByApprover = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true && (al.ApprovalStatusId == approvedApprovalStatusId || al.ApprovalStatusId == rejectedApprovalStatusId || arav.ApprovalStatusId != null))));
            answeredByApprover = answeredReqByApprover.Count();//approvalLevelsAsApprover.Where(ar => ar.ApprovalRequestApproverOrViewers.Any(arav => arav.ApprovalStatusId != null)).Count();
            awaitingForApprover = totalRequestedToApprover - answeredByApprover;
            decimal averageApprovedByApprover = 0;
            if (totalRequestedToApprover > 0 && answeredByApprover > 0)
            {
                var sqlToCalculateAverage = "SELECT ISNULL(Avg(((DATEDIFF(HOUR,Created,ResponseDate)-(DATEDIFF(DAY,Created,ResponseDate))*15.0))/9.0),0)" +
                    "  FROM [dbo].[ApprovalRequestApproverOrViewer] WHERE [ApprovalStatusId]=" + approvedApprovalStatusId + " AND IsApprover=1 AND UserId='" + userInfo.Id + "'";
                averageApprovedByApprover = db.Database.SqlQuery<decimal>(sqlToCalculateAverage).First();
            }
            return Ok(
                new
                {
                    Requested = totalRequestedAsRequester,
                    Awaiting = awaitingForRequester,
                    Approved = approvedForRequester,
                    Rejected = rejectedForRequester,
                    AverageApproved = averageApprovedForRequester,
                    ApproverTotalRequested = totalRequestedToApprover,
                    ApproverPending = awaitingForApprover,
                    ApproverTotalAnswered = answeredByApprover,
                    ApproverAverageApproved = averageApprovedByApprover
                }
                );
        }

        [HttpGet]
        [Route("GetApprovalRequestById/{id}")]
        public IHttpActionResult GetApprovalRequestById(Guid id)
        {
            var userInfo = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
            var approvalRequest = db.ApprovalRequests.FirstOrDefault(x => x.Id == id);
            if (approvalRequest == null)
                return NotFound();
            var approvalRequestVM = MapApprovalRequestToApprovalRequestVM(approvalRequest, userInfo.AadObjectId);
            return Ok(approvalRequestVM);
        }
        [HttpGet]
        [Route("GetApprovalRequests")]
        public IHttpActionResult GetApprovalRequests(string userPrincipal, DateTime startDate, DateTime endDate, int selectedFilter, int pageIndex)
        {
            //var userInfo = db.UserInfoes.FirstOrDefault(u => u.UserPrincipalName == userPrincipal);
            var userInfo = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
            if (userInfo == null) return null;
            int pageSize = 10;
            SaveUserPreferences(userInfo.UserPrincipalName, selectedFilter);
            List<ApprovalRequestVM> approvalRequests = new List<ApprovalRequestVM>();


            //var approvalStatus = db.ApprovalStatus.ToList();
            //int pendingApprovalStatusId = approvalStatus.FirstOrDefault(ast => ast.Name == LanguageKeyValues.Pending).Id;
            //int approvedApprovalStatusId = approvalStatus.FirstOrDefault(ast => ast.Name == LanguageKeyValues.Approved).Id;
            //int rejectedApprovalStatusId = approvalStatus.FirstOrDefault(ast => ast.Name == LanguageKeyValues.Rejected).Id;
            int pendingApprovalStatusId = Utilities.Constants.PendingApprovalStatusId;
            int approvedApprovalStatusId = Utilities.Constants.ApprovedApprovalStatusId;
            int rejectedApprovalStatusId = Utilities.Constants.RejectedApprovalStatusId;
            IQueryable<ApprovalRequest> approvalRequestsInDB = null;
            switch (selectedFilter)
            {
                case 1://Applicant - all requests
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.RequesterUserId == userInfo.Id && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate
                && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate));
                    }
                    break;
                case 2:// Applicant - pending
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.RequesterUserId == userInfo.Id && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate
                && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate) && (ar.ApprovalStatusId == null || ar.ApprovalStatusId == pendingApprovalStatusId));
                    }
                    break;
                case 3://Applicant - approved
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.RequesterUserId == userInfo.Id && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate
                && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate) && ar.ApprovalStatusId == approvedApprovalStatusId);
                    }
                    break;
                case 4://Applicant - rejected
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.RequesterUserId == userInfo.Id && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate
                && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate) && ar.ApprovalStatusId == rejectedApprovalStatusId);
                    }
                    break;
                case 5://Approver - all requested to
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true) && al.LevelNo <= ar.CurrentLevel)
                && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate));
                    }
                    break;
                case 6://Approver - not responded
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => (al.ApprovalStatusId == null || al.ApprovalStatusId == pendingApprovalStatusId) && al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true && (arav.ApprovalStatusId == null || arav.ApprovalStatusId == pendingApprovalStatusId)) && al.LevelNo == ar.CurrentLevel)
                && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate));
                    }
                    break;
                case 7://Approver - responded
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == true && (al.ApprovalStatusId == approvedApprovalStatusId || al.ApprovalStatusId == rejectedApprovalStatusId || arav.ApprovalStatusId != null)))
                && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate));
                    }
                    break;
                case 8://Reader - all requests
                    {
                        approvalRequestsInDB = db.ApprovalRequests.
                Where(ar => ar.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.UserId == userInfo.Id && arav.IsApprover == false) && al.LevelNo == ar.CurrentLevel)
                && (DbFunctions.TruncateTime(ar.RequestedDate) >= startDate && DbFunctions.TruncateTime(ar.RequestedDate) <= endDate));
                    }
                    break;
                default:
                    break;
            }
            var queryResult = approvalRequestsInDB.OrderByDescending(ar => ar.RequestedDate).Skip(pageSize * (pageIndex)).Take(pageSize);
            foreach (var approvalRequest in queryResult)
            {
                var approvalRequestVM = new ApprovalRequestVM();
                approvalRequestVM.Id = approvalRequest.Id;
                approvalRequestVM.ApprovalStatus = MapApprovalStatus(approvalRequest.ApprovalStatusId);
                approvalRequestVM.Details = approvalRequest.Details;
                //approvalRequestVM.IsSingleApprover = approvalRequest.IsSingleApprover;
                approvalRequestVM.ParentApprovalRequestId = approvalRequest.ParentApprovalRequestId;
                //approvalRequestVM.RequesterUserPrincipalName= approvalRequest.RequesterUserId
                approvalRequestVM.Title = approvalRequest.Title;
                approvalRequestVM.TotalLevel = approvalRequest.TotalLevel;
                approvalRequestVM.CurrentLevel = approvalRequest.CurrentLevel;
                approvalRequestVM.TemplateId = approvalRequest.TemplateId.HasValue ? approvalRequest.TemplateId.Value : Guid.Empty;
                approvalRequestVM.TemplateName = approvalRequest.Template?.Name;
                approvalRequestVM.DesiredCompletionDate = approvalRequest.DesiredCompletionDate;
                //approvalRequestVM.ApproverList = new List<UserOrGroupVM>();
                //approvalRequestVM.ViewerList = new List<UserOrGroupVM>();
                approvalRequestVM.Levels = new List<Level>();
                if (approvalRequest.RequestAttachments != null)
                {
                    approvalRequestVM.AttachmentCount = approvalRequest.RequestAttachments.Count();
                }
                foreach (var al in approvalRequest.ApprovalLevels)
                {
                    Level level = new Level
                    {
                        IsSingleApprover = al.IsSingleApprover,
                        LevelName = al.LevelName,
                        LevelNo = al.LevelNo,
                        ApprovalStatusId = al.ApprovalStatusId,
                        ResponseDate = al.ResponseDate?.ToUTCStr(),
                        IsCurrentLevel = approvalRequest.CurrentLevel == al.LevelNo,
                        IsApproveOnly = al.IsApproveOnly,
                    };
                    foreach (var item in al.ApprovalRequestApproverOrViewers)
                    {
                        var user = item.UserInfo;
                        if (item.IsApprover)
                        {
                            if (al.LevelNo == approvalRequest.CurrentLevel)
                            {
                                approvalRequestVM.TotalApproversInCurrentLevel++;
                                approvalRequestVM.TotalRespondedInCurrentLevel++;
                            }
                            approvalRequestVM.TotalApprovers++;
                            if (item.ApprovalStatusId != null)
                            {
                                approvalRequestVM.TotalResponded++;
                            }
                            level.ApproverList.Add(new UserOrGroupVM
                            {
                                Name = user.Name,
                                AadObjectId = user.AadObjectId,
                                HasApproved = MapApprovalStatus(item.ApprovalStatusId),
                                Comment = item.Comment,
                                ResponseDate = item.ResponseDate.HasValue ? item.ResponseDate.Value.ToUTCStr() : null,
                                UserPrincipalName = user.UserPrincipalName
                            });
                        }
                        else
                        {
                            level.ViewerList.Add(new UserOrGroupVM
                            {
                                Name = user.Name,
                                AadObjectId = user.AadObjectId,
                                UserPrincipalName = user.UserPrincipalName
                            });
                        }
                    }
                    approvalRequestVM.Levels.Add(level);
                }
                approvalRequestVM.Attachments = new List<RequestAttachmentVM>();

                foreach (var file in approvalRequest.RequestAttachments)
                {
                    var createdUser = file.UserInfo;
                    approvalRequestVM.Attachments.Add(new RequestAttachmentVM
                    {
                        FileName = file.FileName,
                        Created = file.Created.ToUTCStr(),
                        CreatedBy = new UserOrGroupVM
                        {
                            AadObjectId = createdUser.AadObjectId,
                            Name = createdUser.Name,
                            UserPrincipalName = createdUser.UserPrincipalName
                        },
                    });
                }
                if (approvalRequestVM.Levels.Count > 0)
                    approvalRequestVM.CurrentLevelDetails = approvalRequestVM.Levels.FirstOrDefault(x => x.IsCurrentLevel == true);
                approvalRequestVM.RequestCreator = new UserOrGroupVM
                {
                    AadObjectId = approvalRequest.UserInfo.AadObjectId,
                    Name = approvalRequest.UserInfo.Name,
                    UserPrincipalName = approvalRequest.UserInfo.UserPrincipalName,
                };
                approvalRequestVM.RequestDate = approvalRequest.RequestedDate.Value.ToUTCStr();
                approvalRequests.Add(approvalRequestVM);
            }
            return Ok(approvalRequests);
        }
        private bool? MapApprovalStatus(int? statusId)
        {
            bool? approvalStatus = null;
            if (statusId == Utilities.Constants.ApprovedApprovalStatusId)
                approvalStatus = true;
            else if (statusId == Utilities.Constants.RejectedApprovalStatusId)
                approvalStatus = false;

            return approvalStatus;
        }
        [HttpPost]
        [Route("PostApprovalRequest")]
        public async Task<IHttpActionResult> PostApprovalRequestsAsync()
        {
            var currentHttpReqeust = HttpContext.Current.Request;
            if (currentHttpReqeust["requestData"] == null)
            {
                logger.Error(new Exception("request Data is null"));
                return InternalServerError();
            }
            ApprovalRequestVM approvalRequestVM;
            try
            {
                approvalRequestVM = JsonConvert.DeserializeObject<ApprovalRequestVM>(currentHttpReqeust["requestData"]);
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
            if (approvalRequestVM == null)
            {
                logger.Error(new Exception("request Data is invalid"));
                return InternalServerError();
            }
            var now = DateTime.UtcNow;
            ApprovalRequest approvalRequest = new ApprovalRequest();
            try
            {
                var requesterUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);

                if (requesterUser == null)
                {
                    logger.Error(new Exception("request user not found"));
                    return InternalServerError();
                }
                var tenantInfo = db.TenantInfoes.FirstOrDefault(x => x.TenantId == approvalRequestVM.TenantId);
                if (tenantInfo == null)
                {
                    logger.Error(new Exception("tenant info not found"));
                    return InternalServerError();
                }
                var graphClient = MSGraphClient.GetAuthenticatedClient(Request.Headers.Authorization.Parameter);
                if (approvalRequestVM.Id.HasValue)//for update
                {
                    var approvalRequestInDb = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestVM.Id);
                    if (approvalRequestInDb != null)
                    {
                        //check if approval in progress
                        if (approvalRequestInDb.ApprovalLevels.Any(x => x.ApprovalRequestApproverOrViewers.Any(arav => arav.ApprovalStatusId != null)))
                        {
                            if (approvalRequestInDb.ApprovalStatusId != Utilities.Constants.RejectedApprovalStatusId)//Not Rejected
                            {
                                logger.Error(new Exception("can not process, approval in progress"));
                                return InternalServerError();
                            }
                        }
                        RemoveDeletedFiles(currentHttpReqeust);
                        approvalRequestInDb.ApprovalStatusId = null;
                        approvalRequestInDb.ResponseDate = null;
                        //remove previous approver/viewer          
                        var approvalLevelsInDb = db.ApprovalLevels.Where(x => x.ApprovalRequestId == approvalRequestVM.Id);
                        foreach (var level in approvalLevelsInDb)
                        {
                            db.ApprovalRequestApproverOrViewers.RemoveRange(db.ApprovalRequestApproverOrViewers.Where(x => x.ApprovalLevelId == level.Id));
                            db.ApprovalLevels.Remove(level);
                        }
                        db.SaveChanges();
                        //approvalRequest = approvalRequestInDb;
                        approvalRequest = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestVM.Id);
                    }
                }
                else
                {

                    approvalRequest.Created = now;
                    approvalRequest.Id = Guid.NewGuid();
                    approvalRequest.RequestedDate = now;
                    //approvalRequest.CurrentLevel = 1;
                    db.ApprovalRequests.Add(approvalRequest);
                }
                if (approvalRequestVM.TemplateId != Guid.Empty)
                    approvalRequest.TemplateId = approvalRequestVM.TemplateId;
                else
                    approvalRequest.TemplateId = null;
                approvalRequest.TotalLevel = approvalRequestVM.TotalLevel;
                approvalRequest.RequesterUserId = requesterUser.Id;
                approvalRequest.Title = approvalRequestVM.Title;
                approvalRequest.TenantInfoId = tenantInfo.Id;
                approvalRequest.ApprovalStatusId = Constants.PendingApprovalStatusId;
                //approvalRequest.IsSingleApprover = approvalRequestVM.IsSingleApprover;
                approvalRequest.Details = HttpUtility.UrlDecode(approvalRequestVM.Details);// approvalRequestVM.Details;
                approvalRequest.Modified = now;
                approvalRequest.CurrentLevel = 1;
                approvalRequest.DesiredCompletionDate = approvalRequestVM.DesiredCompletionDate;
                db.SaveChanges();

                foreach (var level in approvalRequestVM.Levels)
                {
                    ApprovalLevel approvalLevel = new ApprovalLevel
                    {
                        Created = now,
                        Id = Guid.NewGuid(),
                        IsSingleApprover = level.IsSingleApprover,
                        LevelName = level.LevelName,
                        LevelNo = level.LevelNo,
                        ApprovalStatusId = Constants.PendingApprovalStatusId,
                        //ResponseDate = level.ResponseDate,
                        ApprovalRequestId = approvalRequest.Id,
                        IsApproveOnly = level.IsApproveOnly,
                    };
                    db.ApprovalLevels.Add(approvalLevel);
                    if (level.ApproverList != null)
                    {
                        if (level.ApproverList.Any(a => a.IsGroup == true))//if there is any group in approver list
                        {
                            var usersInGroup = new List<UserOrGroupVM>();
                            foreach (var approverGroup in level.ApproverList.Where(x => x.IsGroup == true))
                            {
                                var userList = await Common.GetUsersOfGroup(approverGroup.AadObjectId.ToString(), approverGroup.Name, graphClient);
                                if (userList.Count > 0)
                                {
                                    usersInGroup.AddRange(userList);
                                }
                            }
                            if (usersInGroup.Count > 0)
                            {
                                level.ApproverList.AddRange(usersInGroup);
                            }
                        }
                        foreach (var approver in level.ApproverList.Where(x => x.IsGroup == false))
                        {
                            var approverUser = Common.InsertUserIfNotExists(db, now, tenantInfo.Id, approver);
                            var approvalRequestApproverOrViewer = PrepareApprovalRequestApproverOrViewer(now, approvalRequest, approverUser.Id, true, approver.GroupName, approvalLevel.Id);
                            db.ApprovalRequestApproverOrViewers.Add(approvalRequestApproverOrViewer);

                        }
                    }
                    if (level.ViewerList != null)
                    {
                        if (level.ViewerList.Any(a => a.IsGroup == true))//if there is any group in viewer list
                        {
                            var usersInGroup = new List<UserOrGroupVM>();
                            foreach (var viewerGroup in level.ViewerList.Where(x => x.IsGroup == true))
                            {
                                var userList = await Common.GetUsersOfGroup(viewerGroup.AadObjectId.ToString(), viewerGroup.Name, graphClient);
                                if (userList.Count > 0)
                                {
                                    usersInGroup.AddRange(userList);
                                }
                            }
                            if (usersInGroup.Count > 0)
                            {
                                level.ViewerList.AddRange(usersInGroup);
                            }
                        }
                        foreach (var viewer in level.ViewerList.Where(x => x.IsGroup == false))
                        {
                            var viewerUser = Common.InsertUserIfNotExists(db, now, tenantInfo.Id, viewer);
                            var approvalRequestApproverOrViewer = PrepareApprovalRequestApproverOrViewer(now, approvalRequest, viewerUser.Id, false, viewer.GroupName, approvalLevel.Id);
                            db.ApprovalRequestApproverOrViewers.Add(approvalRequestApproverOrViewer);
                        }
                    }
                }
                db.SaveChanges();
                AddRemarksToRequest(approvalRequest.Id, approvalRequestVM, requesterUser.Id);
                UploadComputerFilesToBlob(approvalRequest.Id, requesterUser.Id);
                await UploadOneDriveFilesToBlobAsync(approvalRequest.Id, graphClient, requesterUser.Id);
                ApprovalRequestCardManager approvalrequestCardManager = new ApprovalRequestCardManager();
                await approvalrequestCardManager.SendCardsToApproverOrViewerAsync(requesterUser.UserPrincipalName, approvalRequest.Id);
                var latestApprovalRequest = db.ApprovalRequests.Include(x => x.UserInfo).Include(x => x.RequestAttachments)
                    .Include(x => x.ApprovalLevels)
                    .FirstOrDefault(x => x.Id == approvalRequest.Id);
                return Ok(MapApprovalRequestToApprovalRequestVM(latestApprovalRequest, requesterUser.AadObjectId));
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                //clear the data if it is for Create request
                if (approvalRequest.Id != Guid.Empty && approvalRequestVM.Id == null)//approvalRequestVM.Id==null is for create request
                {
                    DeleteApprovalRequest(approvalRequest.Id);
                }
                return InternalServerError();
            }

        }

        [HttpPost]
        [Route("PostRemarkAndFiles")]
        public async Task<IHttpActionResult> PostRemarkAndFilesAsync()
        {
            try
            {
                var currentHttpReqeust = HttpContext.Current.Request;
                if (currentHttpReqeust["requestData"] == null)
                {
                    logger.Error(new Exception("request Data is null"));
                    return InternalServerError();
                }
                ApprovalRequestVM approvalRequestVM = JsonConvert.DeserializeObject<ApprovalRequestVM>(currentHttpReqeust["requestData"]);
                if (approvalRequestVM == null)
                {
                    logger.Error(new Exception("request Data has invalid data"));
                    return InternalServerError();
                }

                var now = DateTime.UtcNow;
                ApprovalRequest approvalRequest = new ApprovalRequest();

                var requesterUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
                if (requesterUser == null)
                {
                    logger.Error(new Exception("request user not found"));
                    return InternalServerError();
                }

                var graphClient = MSGraphClient.GetAuthenticatedClient(Request.Headers.Authorization.Parameter);
                if (approvalRequestVM.Id.HasValue)
                {
                    var approvalRequestInDb = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestVM.Id);
                    if (approvalRequestInDb != null)
                    {
                        RemoveDeletedFiles(currentHttpReqeust);
                        approvalRequest = db.ApprovalRequests.FirstOrDefault(ar => ar.Id == approvalRequestVM.Id);
                    }
                    else
                    {
                        logger.Error(new Exception("approval request not found in database"));
                        return BadRequest();
                    }
                }
                else
                {
                    logger.Error(new Exception("approval request id not found"));
                    return BadRequest();
                }

                AddRemarksToRequest(approvalRequest.Id, approvalRequestVM, requesterUser.Id);
                UploadComputerFilesToBlob(approvalRequest.Id, requesterUser.Id);
                await UploadOneDriveFilesToBlobAsync(approvalRequest.Id, graphClient, requesterUser.Id);
                var latestApprovalRequest = db.ApprovalRequests.Include(x => x.UserInfo).Include(x => x.RequestAttachments)
                    .Include(x => x.ApprovalLevels)
                    .FirstOrDefault(x => x.Id == approvalRequest.Id);
                return Ok(MapApprovalRequestToApprovalRequestVM(latestApprovalRequest, requesterUser.AadObjectId));
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                return InternalServerError();
            }

        }

        private void RemoveDeletedFiles(HttpRequest currentHttpReqeust)
        {
            if (currentHttpReqeust["removedFiles"] != null)
            {
                List<RequestAttachment> requestAttachmentsToRemove = JsonConvert.DeserializeObject<List<RequestAttachment>>(currentHttpReqeust["removedFiles"]);
                if (requestAttachmentsToRemove != null || requestAttachmentsToRemove.Count > 0)
                {
                    foreach (var fileToRemove in requestAttachmentsToRemove)
                    {
                        var fileRefInDb = db.RequestAttachments.FirstOrDefault(ra => ra.Id == fileToRemove.Id);
                        db.RequestAttachments.Remove(fileRefInDb);
                        Uri uri = new Uri(fileToRemove.BlobUrl);
                        string fileName = System.IO.Path.GetFileName(uri.LocalPath);
                        fileToRemove.FileName = fileName;
                    }
                    DeleteFilesFromBlob(requestAttachmentsToRemove);
                }

            }
        }
        private ApprovalRequestApproverOrViewer PrepareApprovalRequestApproverOrViewer(DateTime now, ApprovalRequest approvalRequest, Guid approverUserId, bool isApprover, string groupName, Guid approvalLevelId)
        {
            var approvalRequestApproverOrViewer = new ApprovalRequestApproverOrViewer();
            approvalRequestApproverOrViewer.Id = Guid.NewGuid();
            approvalRequestApproverOrViewer.IsApprover = isApprover;
            approvalRequestApproverOrViewer.UserId = approverUserId;
            approvalRequestApproverOrViewer.Created = now;
            //approvalRequestApproverOrViewer.ApprovalRequestId = approvalRequest.Id;
            approvalRequestApproverOrViewer.ApprovalLevelId = approvalLevelId;
            approvalRequestApproverOrViewer.GroupInfo = groupName;
            return approvalRequestApproverOrViewer;
        }



        private void AddRemarksToRequest(Guid approvalRequestId, ApprovalRequestVM approvalRequestVM, Guid createdUserId)
        {
            //if (approvalRequestVM.RequestRemarks != null)
            //{
            //    foreach (var remark in approvalRequestVM.RequestRemarks)
            //    {
            //        db.RequestRemarks.Add(new RequestRemark
            //        {
            //            ApprovalRequestId = approvalRequestId,
            //            Created = DateTime.UtcNow,
            //            CreatedUserId = createdUserId,
            //            Remark = remark.Remark
            //        });
            //    }
            //    db.SaveChanges();
            //}
            if (!string.IsNullOrEmpty(approvalRequestVM.PostedRemark))
            {
                db.RequestRemarks.Add(new RequestRemark
                {
                    Id = Guid.NewGuid(),
                    ApprovalRequestId = approvalRequestId,
                    Created = DateTime.UtcNow,
                    CreatedUserId = createdUserId,
                    Remark = HttpUtility.UrlDecode(approvalRequestVM.PostedRemark)
                });
            }
            db.SaveChanges();

        }

        private void UploadComputerFilesToBlob(Guid approvalRequestId, Guid createUserInfoId)
        {

            try
            {
                var now = DateTime.UtcNow;
                if (HttpContext.Current.Request.Files.Count > 0)
                {
                    List<RequestAttachmentVM> requestAttachments = new List<RequestAttachmentVM>();
                    for (int i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                    {
                        var file = HttpContext.Current.Request.Files[i];
                        var container = GetBlobContainer(Guid.Parse(HttpContext.Current.Request["tenantId"]));
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference(file.FileName);
                        int j = 0;
                        while (blockBlob.Exists())
                        {
                            string newfileName = string.Format("{0}-{1}{2}", Path.GetFileNameWithoutExtension(file.FileName), j.ToString("0000"), Path.GetExtension(file.FileName));
                            blockBlob = container.GetBlockBlobReference(newfileName);
                            j++;
                        }
                        blockBlob.UploadFromStream(file.InputStream);
                        requestAttachments.Add(new RequestAttachmentVM
                        {
                            FileName = file.FileName,
                            FileSize = file.ContentLength,
                            FileUrl = blockBlob.Uri.ToString()
                        });

                    }
                    foreach (var requestAttachment in requestAttachments)
                    {
                        db.RequestAttachments.Add(new RequestAttachment
                        {
                            BlobUrl = requestAttachment.FileUrl,
                            FileName = requestAttachment.FileName,
                            FileSize = requestAttachment.FileSize,
                            Id = Guid.NewGuid(),
                            Created = now,
                            ApprovalRequestId = approvalRequestId,
                            CreatedUserId = createUserInfoId
                        });
                    }
                    db.SaveChanges();

                }



            }
            catch (Exception ex)
            {
                throw;
            }


        }
        private void DeleteFilesFromBlob(List<RequestAttachment> requestAttachmentsToRemove, Guid? tenantId = null)
        {
            try
            {
                if (requestAttachmentsToRemove.Count > 0)
                {
                    Guid tid = tenantId.HasValue ? tenantId.Value : Guid.Parse(HttpContext.Current.Request["tenantId"]);
                    var container = GetBlobContainer(tid);
                    foreach (var requestAttachment in requestAttachmentsToRemove)
                    {
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference(requestAttachment.FileName);
                        blockBlob.DeleteIfExists();
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //TODO will try to do parallel processing if possible https://stackoverflow.com/questions/19431494/how-to-use-await-in-a-loop#:~:text=The%20way%20you're%20using,ing%20them%20all%20with%20Task.
        private async Task UploadOneDriveFilesToBlobAsync(Guid approvalRequestId, GraphServiceClient graphClient, Guid createUserInfoId)
        {

            try
            {
                var now = DateTime.UtcNow;
                if (HttpContext.Current.Request["cloudFile"] != null)
                {
                    var postedCloudAttachements = JsonConvert.DeserializeObject<List<RequestAttachmentVM>>(HttpContext.Current.Request["cloudFile"]);

                    List<RequestAttachmentVM> requestAttachments = new List<RequestAttachmentVM>();
                    foreach (var cloudFile in postedCloudAttachements)
                    {
                        var stream = await graphClient.Me.Drive.Items[cloudFile.FileId].Content
                                    .Request()
                                    .GetAsync();

                        var container = GetBlobContainer(Guid.Parse(HttpContext.Current.Request["tenantId"]));
                        CloudBlockBlob blockBlob = container.GetBlockBlobReference(cloudFile.FileName);
                        int j = 0;
                        while (blockBlob.Exists())
                        {
                            string newfileName = string.Format("{0}-{1}{2}", Path.GetFileNameWithoutExtension(cloudFile.FileName), j.ToString("0000"), Path.GetExtension(cloudFile.FileName));
                            blockBlob = container.GetBlockBlobReference(newfileName);
                            j++;
                        }
                        blockBlob.UploadFromStream(stream);
                        requestAttachments.Add(new RequestAttachmentVM
                        {
                            FileName = cloudFile.FileName,
                            FileSize = cloudFile.FileSize,
                            FileUrl = blockBlob.Uri.ToString()
                        });
                    }


                    using (var db = new CookaiApprovalDB())
                    {
                        foreach (var requestAttachment in requestAttachments)
                        {
                            db.RequestAttachments.Add(new RequestAttachment
                            {
                                BlobUrl = requestAttachment.FileUrl,
                                FileName = requestAttachment.FileName,
                                FileSize = requestAttachment.FileSize,
                                Id = Guid.NewGuid(),
                                Created = now,
                                ApprovalRequestId = approvalRequestId,
                                CreatedUserId = createUserInfoId
                            });
                        }
                        db.SaveChanges();
                    }

                }



            }
            catch (Exception ex)
            {
                throw;
            }


        }
        private CloudBlobContainer GetBlobContainer(Guid tenantId)
        {
            try
            {
                var storageConnectionString = ConfigurationManager.AppSettings["StorageConnectionString"];
                CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
                CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();


                string containerName = tenantId.ToString();
                CloudBlobContainer container = blobClient.GetContainerReference(containerName);
                bool created = container.CreateIfNotExists();
                container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });

                return container;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost]
        [Route("ApproveOrReject")]
        public async Task<IHttpActionResult> ApproveOrRejectAsync(ApproveOrRejectRequestVM requestVM)
        {

            try
            {
                ApprovalRequest modifiedApprovalRequest = null;
                if (requestVM == null)
                    return InternalServerError();
                //var userInfo = db.UserInfoes.FirstOrDefault(u => u.UserPrincipalName == requestVM.UserPrincipal);
                var userInfo = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);

                if (userInfo != null)
                {
                    ApprovalRequestProcessor approvalRequestProcessor = new ApprovalRequestProcessor();
                    var result = await approvalRequestProcessor.ApproveOrRejectAsync(requestVM.ApprovalRequestId, userInfo.AadObjectId, requestVM.Comment, requestVM.IsForApprove, db);
                    modifiedApprovalRequest = result.ApprovalRequest;
                    if (modifiedApprovalRequest != null)
                    {
                        var approvalRequestVM = MapApprovalRequestToApprovalRequestVM(modifiedApprovalRequest, userInfo.AadObjectId);
                        return Ok(approvalRequestVM);
                    }
                    else
                    {
                        return InternalServerError();
                    }
                }
                return Ok(modifiedApprovalRequest);
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }

        private ApprovalRequestVM MapApprovalRequestToApprovalRequestVM(ApprovalRequest approvalRequest, Guid loggedInUserAADId)
        {
            ApprovalRequestVM approvalRequestVM = new ApprovalRequestVM();
            approvalRequestVM.Id = approvalRequest.Id;
            approvalRequestVM.ApprovalStatus = MapApprovalStatus(approvalRequest.ApprovalStatusId);
            approvalRequestVM.Details = approvalRequest.Details;
            //approvalRequestVM.IsSingleApprover = approvalRequest.IsSingleApprover;
            approvalRequestVM.ParentApprovalRequestId = approvalRequest.ParentApprovalRequestId;
            approvalRequestVM.RequestDate = approvalRequest.RequestedDate.Value.ToUTCStr();// for sending UTC
            approvalRequestVM.Title = approvalRequest.Title;
            approvalRequestVM.CurrentLevel = approvalRequest.CurrentLevel;
            approvalRequestVM.TotalLevel = approvalRequest.TotalLevel;
            approvalRequestVM.Levels = new List<Level>();
            approvalRequestVM.TemplateId = approvalRequest.TemplateId.HasValue ? approvalRequest.TemplateId.Value : Guid.Empty;
            approvalRequestVM.TemplateName = approvalRequest.Template?.Name;
            approvalRequestVM.DesiredCompletionDate = approvalRequest.DesiredCompletionDate;
            //approvalRequestVM.ApproverList = new List<UserOrGroupVM>();
            //approvalRequestVM.ViewerList = new List<UserOrGroupVM>();
            foreach (var item in approvalRequest.ApprovalLevels)
            {
                Level level = new Level
                {
                    IsSingleApprover = item.IsSingleApprover,
                    LevelName = item.LevelName,
                    LevelNo = item.LevelNo,
                    ApprovalStatusId = item.ApprovalStatusId,
                    ResponseDate = item.ResponseDate?.ToUTCStr(),
                    IsCurrentLevel = approvalRequest.CurrentLevel == item.LevelNo,
                    IsApproveOnly = item.IsApproveOnly,
                };
                foreach (var approverUser in item.ApprovalRequestApproverOrViewers)
                {
                    var user = approverUser.UserInfo;
                    if (approverUser.IsApprover)
                    {
                        if (item.LevelNo == approvalRequest.CurrentLevel)
                        {
                            approvalRequestVM.TotalApproversInCurrentLevel++;
                            approvalRequestVM.TotalRespondedInCurrentLevel++;
                        }
                        approvalRequestVM.TotalApprovers++;

                        level.ApproverList.Add(new UserOrGroupVM
                        {
                            Name = user.Name,
                            AadObjectId = user.AadObjectId,
                            HasApproved = MapApprovalStatus(approverUser.ApprovalStatusId),
                            Comment = approverUser.Comment,
                            //ResponseDate = item.ResponseDate.HasValue ? item.ResponseDate.Value.ToUTCStr() : null,// for sending UTC
                            ResponseDate = approverUser.ResponseDate.HasValue ? approverUser.ResponseDate.Value.ToUTCStr() : null,// for sending UTC
                            UserPrincipalName = user.UserPrincipalName
                        });
                    }
                    else
                    {
                        level.ViewerList.Add(new UserOrGroupVM
                        {
                            Name = user.Name,
                            AadObjectId = user.AadObjectId,
                            UserPrincipalName = user.UserPrincipalName

                        });
                    }
                }
                approvalRequestVM.Levels.Add(level);
            }
            approvalRequestVM.IsProcessingStarted = approvalRequest.ApprovalLevels.Any(al => al.ApprovalRequestApproverOrViewers.Any(arav => arav.ApprovalStatusId != null));
            if (approvalRequestVM.Levels.Count > 0)
                approvalRequestVM.CurrentLevelDetails = approvalRequestVM.Levels.FirstOrDefault(x => x.IsCurrentLevel == true);
            approvalRequestVM.Attachments = new List<RequestAttachmentVM>();
            foreach (var file in approvalRequest.RequestAttachments)
            {
                var createdUser = file.UserInfo;
                approvalRequestVM.Attachments.Add(new RequestAttachmentVM
                {
                    FileName = file.FileName,
                    FileSize = file.FileSize,
                    FileUrl = file.BlobUrl,
                    FileId = file.Id.ToString(),
                    Created = file.Created.ToUTCStr(),
                    CreatedBy = new UserOrGroupVM
                    {
                        AadObjectId = createdUser.AadObjectId,
                        Name = createdUser.Name,
                        UserPrincipalName = createdUser.UserPrincipalName
                    },
                    IsDeletable = loggedInUserAADId == createdUser.AadObjectId
                });
            }
            approvalRequestVM.RequestRemarks = new List<RequestRemarkVM>();
            foreach (var remark in approvalRequest.RequestRemarks)
            {
                var createdUser = remark.UserInfo;
                approvalRequestVM.RequestRemarks.Add(new RequestRemarkVM
                {
                    Created = remark.Created.ToUTCStr(),
                    CreatedBy = new UserOrGroupVM
                    {
                        AadObjectId = createdUser.AadObjectId,
                        Name = createdUser.Name,
                        UserPrincipalName = createdUser.UserPrincipalName
                    },
                    Id = remark.Id,
                    Remark = remark.Remark
                });
            }
            if (approvalRequest.RequestAttachments != null)
            {
                approvalRequestVM.AttachmentCount = approvalRequest.RequestAttachments.Count();
            }
            approvalRequestVM.RequestCreator = new UserOrGroupVM
            {
                AadObjectId = approvalRequest.UserInfo.AadObjectId,
                Name = approvalRequest.UserInfo.Name,
                UserPrincipalName = approvalRequest.UserInfo.UserPrincipalName
            };
            return approvalRequestVM;
        }

        [HttpGet]
        [Route("GetSeletedFilterStatus")]
        public int GetSeletedFilterStatus(String useremail)
        {
            int selectedStatusId = 2;//2 is default value
            var userInfo = db.UserInfoes.FirstOrDefault(u => u.UserPrincipalName == useremail);
            if (userInfo != null)
            {
                var userPreference = db.UserPreferences.FirstOrDefault(u => u.UserId == userInfo.Id);
                if (userPreference != null)
                {
                    selectedStatusId = userPreference.SeletedFilterStatus ?? selectedStatusId;
                }
            }
            return selectedStatusId;
        }
        private void SaveUserPreferences(string userEmail, int statusId)
        {
            var userInfo = db.UserInfoes.FirstOrDefault(u => u.UserPrincipalName == userEmail);
            if (userInfo != null)
            {
                var userprefernce = db.UserPreferences.FirstOrDefault(up => up.UserId == userInfo.Id);
                if (userprefernce != null)
                {
                    userprefernce.SeletedFilterStatus = statusId;
                    //userprefernce.Created = DateTime.UtcNow;
                    //db.Entry(userprefernce).State = EntityState.Modified;
                    //db.SaveChanges();
                }
                else
                {
                    db.UserPreferences.Add(new UserPreference
                    {
                        UserId = userInfo.Id,
                        Id = Guid.NewGuid(),
                        SeletedFilterStatus = statusId,
                        Created = DateTime.UtcNow
                    });
                    //db.SaveChanges();
                }
                db.SaveChanges();
            }

        }

        [HttpDelete]
        [Route("DeleteApprovalRequestById/{id}")]
        public IHttpActionResult DeleteApprovalRequestById(Guid id)
        {

            try
            {
                var userInfo = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
                var approvalRequest = db.ApprovalRequests.FirstOrDefault(x => x.Id == id);
                if (approvalRequest == null)
                    return NotFound();
                if (approvalRequest.ApprovalLevels.Any(x => x.ApprovalRequestApproverOrViewers.Any(arav => arav.ApprovalStatusId != null)))//request can be deleted event approved if the user is creator
                {
                    if (!(approvalRequest.ApprovalStatusId == Utilities.Constants.ApprovedApprovalStatusId && approvalRequest.RequesterUserId == userInfo.Id))
                        return Ok(LanguageKeyValues.RequestInProgressError);
                }
                DeleteApprovalRequest(id);
                //return Ok(LanguageKeyValues.RequestProcessed);
                return Ok();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
        }
        private void DeleteApprovalRequest(Guid id)
        {
            using (var localDb = new CookaiApprovalDB())
            {
                var approvalRequest = localDb.ApprovalRequests.FirstOrDefault(x => x.Id == id);
                localDb.ApprovalLevels.RemoveRange(approvalRequest.ApprovalLevels);
                localDb.ApprovalRequestApproverOrViewers.RemoveRange(localDb.ApprovalRequestApproverOrViewers.Where(x => x.ApprovalLevel.ApprovalRequest.Id == approvalRequest.Id));
                if (approvalRequest.RequestAttachments != null && approvalRequest.RequestAttachments.Count > 0)
                {
                    foreach (var fileToRemove in approvalRequest.RequestAttachments)
                    {
                        Uri uri = new Uri(fileToRemove.BlobUrl);
                        string fileName = System.IO.Path.GetFileName(uri.LocalPath);
                        fileToRemove.FileName = fileName;
                    }
                    var tenantid = approvalRequest.UserInfo.TenantInfo.TenantId;
                    DeleteFilesFromBlob(approvalRequest.RequestAttachments.ToList(), tenantid);
                    localDb.RequestAttachments.RemoveRange(approvalRequest.RequestAttachments);
                }
                if (approvalRequest.RequestRemarks != null && approvalRequest.RequestRemarks.Count > 0)
                {
                    localDb.RequestRemarks.RemoveRange(approvalRequest.RequestRemarks);
                }
                localDb.ApprovalRequests.Remove(approvalRequest);
                localDb.SaveChanges();
            }
        }


        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}