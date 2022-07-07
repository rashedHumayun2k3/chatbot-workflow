using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class ApproveOrRejectRequestVM
    {         
        public Guid ApprovalRequestId { get; set; }
        public string UserPrincipal { get; set; }
        public string Comment { get; set; }
        public bool IsForApprove { get; set; }

    }
}