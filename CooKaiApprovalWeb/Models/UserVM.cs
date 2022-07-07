using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class UserVM
    {
        public Guid UserId { get; set; }
        public string AccessToken { get; set; }
        public string TokenExpiryTime { get; set; }
        public string UPN { get; set; }
        public string TeamUserId { get; set; }
    }
}