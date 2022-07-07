using System;
using System.Collections.Generic;

namespace CooKaiApprovalWeb.Models
{

    public class ApprovalRequestVM
    {
        
        public Guid? ParentApprovalRequestId { get; set; }
        public string Title { get; set; }
        //public bool IsSingleApprover { get; set; }
        public string Details { get; set; }
        public string RequesterUserPrincipalName { get; set; }
        //public List<UserOrGroupVM> ApproverList { get; set; }
        //public List<UserOrGroupVM> ViewerList { get; set; }
        public Guid? Id { get;  set; }
        public bool? ApprovalStatus { get;  set; }
        public Guid TenantId { get; set; }
        public Guid FileUploadId { get; set; }
        public List<RequestAttachmentVM> Attachments { get; set; }
        public UserOrGroupVM RequestCreator { get; set; }
        public string RequestDate { get; set; }
        public int AttachmentCount { get; set; }
        //public bool IsForUpdate { get; set; }
        public int TotalApprovers { get; set; }
        public int TotalApproversInCurrentLevel { get; set; }
        public int TotalResponded { get; set; }
        public int TotalRespondedInCurrentLevel { get; set; }
        public int? TotalLevel { get; set; }
        public int? CurrentLevel { get; set; }
        public string PostedRemark { get; set; }
        public List<Level> Levels { get; set; }
        public List<RequestRemarkVM> RequestRemarks { get; set; }
        public Guid TemplateId { get; set; }
        public string TemplateName { get; set; }
        public DateTime? DesiredCompletionDate { get; set; }

        public Level CurrentLevelDetails { get; set; }
        public bool IsProcessingStarted { get; set; }
    }
    public class Level
    {
        public Level()
        {
            this.ApproverList = new List<UserOrGroupVM>();
            this.ViewerList = new List<UserOrGroupVM>();
        }
        public List<UserOrGroupVM> ApproverList { get; set; }
        public List<UserOrGroupVM> ViewerList { get; set; }
        public bool IsSingleApprover { get; set; }
        public string LevelName { get; set; }
        public int LevelNo { get; set; }
        public string ResponseDate { get; set; }
        public int? ApprovalStatusId { get; set; }
        public bool IsCurrentLevel { get; set; }
        public bool IsApproveOnly { get; set; }
    }
}