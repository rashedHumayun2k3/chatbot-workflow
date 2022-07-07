using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class UserOrGroupVM { 
        public string Name { get; set; }
        public Guid AadObjectId { get; set; }
        public bool IsGroup { get; set; }
        public bool? HasApproved { get; set; }
        public string UserPrincipalName { get; set; }
        public string Comment { get; set; }
        public string ResponseDate { get; set; }
        public string GroupName { get;  set; }
       
    }
}