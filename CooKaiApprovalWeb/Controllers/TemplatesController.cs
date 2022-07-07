using CooKaiApprovalWeb.CustomAttributes;
using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Models;
using CooKaiApprovalWeb.Services;
using CooKaiApprovalWeb.Utilities;
using NLog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using System.Threading.Tasks;

namespace CooKaiApprovalWeb.Controllers
{
    [RoutePrefix("api/Templates")]
    [JWTMixAuthorize]
    public class TemplatesController : ApiController
    {
        private CookaiApprovalDB db = new CookaiApprovalDB();
        private static Logger logger = LogManager.GetCurrentClassLogger();
        [HttpGet]
        [Route("")]
        public IHttpActionResult GetTemplates()
        {

            var loggedInUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
            if (loggedInUser == null) return StatusCode(HttpStatusCode.Forbidden);

            var templates = db.Templates.Where(t => t.TenantInfoId == loggedInUser.TenantId);
            var templateVMList = new List<TemplateVM>();
            foreach (var template in templates)
            {
                templateVMList.Add(MapTemplateToTemplateVM(template));
            }
            return Ok(templateVMList);
        }
        [HttpGet]
        [Route("GetTemplatesByCondition")]
        public IHttpActionResult GetTemplatesByCondition(bool isActive)
        {

            var loggedInUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
            if (loggedInUser == null) return StatusCode(HttpStatusCode.Forbidden);

            var templates = db.Templates.Where(t => t.TenantInfoId == loggedInUser.TenantId && t.IsActive == isActive).OrderByDescending(t => t.Created);
            var templateVMList = new List<TemplateVM>();
            foreach (var template in templates)
            {
                templateVMList.Add(MapTemplateToTemplateVM(template));
            }
            return Ok(templateVMList);
        }
        private TemplateVM MapTemplateToTemplateVM(Template template)
        {
            List<StepListVM> stepList = new List<StepListVM>();
            var sortedTemplateLevels = template.TemplateLevels.OrderBy(t => t.LevelNo);
            foreach (var item in sortedTemplateLevels)
            {

                stepList.Add(new StepListVM
                {
                    ApproverList = item.TemplateApproverOrViewers.Where(ta => ta.IsApprover == true).Select(ta => new
                      UserOrGroupVM
                    {
                        Name = ta.UserInfo.Name,
                        AadObjectId = ta.UserInfo.AadObjectId,
                        UserPrincipalName = ta.UserInfo.UserPrincipalName,
                    }).ToList(),
                    ViewerList = item.TemplateApproverOrViewers.Where(ta => ta.IsApprover == false).Select(ta => new
                   UserOrGroupVM
                    {
                        Name = ta.UserInfo.Name,
                        AadObjectId = ta.UserInfo.AadObjectId,
                        UserPrincipalName = ta.UserInfo.UserPrincipalName,

                    }).ToList(),
                    IsSingleApprover = item.IsSingleApprover,
                    LevelName = item.LevelName,
                    LevelNo = item.LevelNo,
                    IsApproveOnly = item.IsApproveOnly
                });
            }



            return new TemplateVM
            {

                Body = template.Body,
                Created = template.Created.ToUTCStr(),// for sending UTC
                Id = template.Id,
                Name = template.Name,
                StepList = stepList,
                Deletable = template.ApprovalRequests.Count() == 0,
                IsActive = template.IsActive
            };
        }
        [HttpPost]
        [Route("CreateTemplate")]
        public async Task<IHttpActionResult> PostTemplateAsync(TemplateVM postedTemplate)
        {
            try
            {
                var now = DateTime.UtcNow;
                var loggedInUser = db.UserInfoes.FirstOrDefault(x => x.UserPrincipalName == User.Identity.Name);
                if (loggedInUser == null) return StatusCode(HttpStatusCode.Forbidden);
                var graphClient = MSGraphClient.GetAuthenticatedClient(Request.Headers.Authorization.Parameter);
                //TODO validate postedTemplate object
                if (postedTemplate != null)
                {
                    var template = new Template
                    {
                        Body = postedTemplate.Body,
                        Created = now,
                        Id = Guid.NewGuid(),
                        Name = postedTemplate.Name,
                        TenantInfoId = loggedInUser.TenantId,
                        IsActive = true,
                    };
                    db.Templates.Add(template);
                    db.SaveChanges();
                    postedTemplate.Id = template.Id;

                    foreach (var level in postedTemplate.StepList)
                    {
                        var templateLevel = new TemplateLevel
                        {
                            Created = now,
                            Id = Guid.NewGuid(),
                            IsSingleApprover = level.IsSingleApprover,
                            LevelName = level.LevelName,
                            LevelNo = level.LevelNo,
                            TemplateId = template.Id,
                            IsApproveOnly = level.IsApproveOnly,
                        };
                        db.TemplateLevels.Add(templateLevel);
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
                                var approverUser = Common.InsertUserIfNotExists(db, now, loggedInUser.TenantId, approver);
                                var templateApproverOrViewer = PrepareTemplateApproverOrViewer(now, templateLevel.Id, approverUser.Id, true, approver.GroupName);
                                db.TemplateApproverOrViewers.Add(templateApproverOrViewer);

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
                                var viewerUser = Common.InsertUserIfNotExists(db, now, loggedInUser.TenantId, viewer);
                                var templateApproverOrViewer = PrepareTemplateApproverOrViewer(now, templateLevel.Id, viewerUser.Id, false, viewer.GroupName);
                                db.TemplateApproverOrViewers.Add(templateApproverOrViewer);
                            }
                        }
                    }
                    db.SaveChanges();

                    var savedTemplate = db.Templates.FirstOrDefault(t => t.Id == postedTemplate.Id);
                    postedTemplate = MapTemplateToTemplateVM(savedTemplate);
                }
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
            return Ok(postedTemplate);
        }
        private TemplateApproverOrViewer PrepareTemplateApproverOrViewer(DateTime now, Guid templateLevelId, Guid approverUserId, bool isApprover, string groupName)
        {
            var templateApproverOrViewer = new TemplateApproverOrViewer();
            templateApproverOrViewer.Id = Guid.NewGuid();
            templateApproverOrViewer.IsApprover = isApprover;
            templateApproverOrViewer.UserId = approverUserId;
            templateApproverOrViewer.Created = now;

            templateApproverOrViewer.GroupInfo = groupName;
            templateApproverOrViewer.TemplateLevelId = templateLevelId;
            return templateApproverOrViewer;
        }
        [HttpDelete]
        [Route("DeleteTemplateById/{id}")]
        public async Task<IHttpActionResult> DeleteTemplate(Guid id)
        {
            try
            {
                var templatedToDelete = await db.Templates.FirstAsync(t => t.Id == id);
                foreach (var level in templatedToDelete.TemplateLevels)
                {
                    db.TemplateApproverOrViewers.RemoveRange(level.TemplateApproverOrViewers);
                }
                db.TemplateLevels.RemoveRange(templatedToDelete.TemplateLevels);
                db.Templates.Remove(templatedToDelete);
                await db.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
            return Ok();
        }
        [HttpPatch]
        [Route("ToggleTemplateVisibility/{id}")]
        public async Task<IHttpActionResult> ToggleTemplateVisibility(Guid id)
        {
            try
            {
                var templateToModify = await db.Templates.FirstAsync(t => t.Id == id);
                templateToModify.IsActive = !templateToModify.IsActive;
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.Error(ex);
                throw;
            }
            return Ok();
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
