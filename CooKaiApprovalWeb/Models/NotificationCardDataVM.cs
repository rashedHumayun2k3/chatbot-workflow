using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class NotificationCardDataVM
    {
        public string title { get; set; }
        public string description { get; set; }
        public int totalApprover { get; set; }
        public int responded { get; set; }
        public string everyoneNeededText { get; set; }
        public string requestedBy { get; set; }
        public Guid approvalRequestId { get; set; }
        public string requestStatusIconUrl { get; set; }
        public List<ApprovalResponseCardVM> approvalResponses { get; set; }
        public List<CardFileAttachmentInfoVM> attachments { get; set; }

        public string approveText { get; set; }
        public string rejectText { get; set; }
        public string commentPlaceHolderText { get; set; }
        public string requestText { get; set; }
        public string reqStatusText { get; set; }
        public string showDetailsText { get; set; }
        public string respondedText { get; set; }
        public string outOfText { get; set; }
        public string attachmentsText { get; set; }
        public string requestedByTextForApprover { get; set; }
        public string hideDetailsText { get; set; }
        public string requestApprovedOrRejectedText { get; set; }
        public string commentText { get; set; }
        public string lineImageUrl { get; set; }
        public int attachmentCount { get; set; }
        public string requestedByTextForViewer { get;  set; }
        public string rejectBtnVisible { get; set; }
    }
}