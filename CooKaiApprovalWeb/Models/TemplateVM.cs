using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class TemplateVM
    {
        public TemplateVM()
        {
            //this.ApproverList = new List<UserOrGroupVM>();
            //this.ViewerList = new List<UserOrGroupVM>();
            this.StepList = new List<StepListVM>();
        }

        public System.Guid Id { get; set; }
        public string Name { get; set; }
        public string Body { get; set; }
        
        public string Created { get; set; }


        //public List<UserOrGroupVM> ApproverList { get; set; }
        //public List<UserOrGroupVM> ViewerList { get; set; }
        public List<StepListVM> StepList { get; set; }
        public bool Deletable { get; set; }
        public bool IsActive { get; set; }

    }
    public class StepListVM
    {
        public StepListVM()
        {
            this.ApproverList = new List<UserOrGroupVM>();
            this.ViewerList = new List<UserOrGroupVM>();
        }
        public List<UserOrGroupVM> ApproverList { get; set; }
        public List<UserOrGroupVM> ViewerList { get; set; }

       
        public bool IsSingleApprover { get; set; }
        public string LevelName { get; set; }
        public int LevelNo { get; set; }
        public bool IsApproveOnly { get; set; }
        
    }
}