using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class RequestRemarkVM
    {
        public System.Guid Id { get; set; }
        public System.Guid ApprovalRequestId { get; set; }
        public string Remark { get; set; }
        
        public string Created { get; set; }
        public UserOrGroupVM CreatedBy { get; set; }
    }
}