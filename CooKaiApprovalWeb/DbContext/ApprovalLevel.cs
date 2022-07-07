//------------------------------------------------------------------------------
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
    using System.Collections.Generic;
    
    public partial class ApprovalLevel
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ApprovalLevel()
        {
            this.ApprovalRequestApproverOrViewers = new HashSet<ApprovalRequestApproverOrViewer>();
        }
    
        public System.Guid Id { get; set; }
        public string LevelName { get; set; }
        public int LevelNo { get; set; }
        public bool IsSingleApprover { get; set; }
        public Nullable<System.DateTime> ResponseDate { get; set; }
        public Nullable<int> ApprovalStatusId { get; set; }
        public System.Guid ApprovalRequestId { get; set; }
        public System.DateTime Created { get; set; }
        public bool IsApproveOnly { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ApprovalRequestApproverOrViewer> ApprovalRequestApproverOrViewers { get; set; }
        public virtual ApprovalRequest ApprovalRequest { get; set; }
        public virtual ApprovalStatu ApprovalStatu { get; set; }
    }
}
