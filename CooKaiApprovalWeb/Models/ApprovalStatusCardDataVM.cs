using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class ApprovalStatusCardDataVM
    {
        public string titleText { get; set; }
        public string bodyText { get; set; }
        public string createApprovalUrl { get; set; }
        public string viewRequestsUrl { get; set; }
        public string createApprovalRequestText { get; set; }
        public string viewRequestsText { get; set; }
    }
}