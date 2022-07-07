using CooKaiApprovalWeb.DbContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class ApproveOrRejectResult
    {
        public string Message { get; set; }
        public ApprovalRequest ApprovalRequest { get; set; }
    }
}