using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class ApprovalResponseCardVM
    {
        public string name { get; set; }
        public string hasApproved { get; set; }
        public string approvalDate { get; set; }
        public string statusIconUrl { get; set; }

    }
}