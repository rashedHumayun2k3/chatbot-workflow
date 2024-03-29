﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace CooKaiApprovalWeb.DbContext
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class CookaiApprovalDB : DbContext
    {
        public CookaiApprovalDB()
            : base("name=CookaiApprovalDB")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<ApprovalLevel> ApprovalLevels { get; set; }
        public virtual DbSet<ApprovalRequestApproverOrViewer> ApprovalRequestApproverOrViewers { get; set; }
        public virtual DbSet<ApprovalRequest> ApprovalRequests { get; set; }
        public virtual DbSet<ApprovalStatu> ApprovalStatus { get; set; }
        public virtual DbSet<PerWebUserCache> PerWebUserCaches { get; set; }
        public virtual DbSet<RequestAttachment> RequestAttachments { get; set; }
        public virtual DbSet<RequestRemark> RequestRemarks { get; set; }
        public virtual DbSet<TemplateApproverOrViewer> TemplateApproverOrViewers { get; set; }
        public virtual DbSet<TemplateLevel> TemplateLevels { get; set; }
        public virtual DbSet<Template> Templates { get; set; }
        public virtual DbSet<TenantInfo> TenantInfoes { get; set; }
        public virtual DbSet<UserInfo> UserInfoes { get; set; }
        public virtual DbSet<UserPreference> UserPreferences { get; set; }
    
        public virtual ObjectResult<ApproveOrReject_Result> ApproveOrReject(Nullable<System.Guid> approvalRequestId, Nullable<System.Guid> memberAADObjectId, string comment, Nullable<bool> isForApprove)
        {
            var approvalRequestIdParameter = approvalRequestId.HasValue ?
                new ObjectParameter("ApprovalRequestId", approvalRequestId) :
                new ObjectParameter("ApprovalRequestId", typeof(System.Guid));
    
            var memberAADObjectIdParameter = memberAADObjectId.HasValue ?
                new ObjectParameter("MemberAADObjectId", memberAADObjectId) :
                new ObjectParameter("MemberAADObjectId", typeof(System.Guid));
    
            var commentParameter = comment != null ?
                new ObjectParameter("Comment", comment) :
                new ObjectParameter("Comment", typeof(string));
    
            var isForApproveParameter = isForApprove.HasValue ?
                new ObjectParameter("IsForApprove", isForApprove) :
                new ObjectParameter("IsForApprove", typeof(bool));
    
            return ((IObjectContextAdapter)this).ObjectContext.ExecuteFunction<ApproveOrReject_Result>("ApproveOrReject", approvalRequestIdParameter, memberAADObjectIdParameter, commentParameter, isForApproveParameter);
        }
    }
}
