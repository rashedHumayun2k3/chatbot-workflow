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
    
    public partial class PerWebUserCache
    {
        public long EntryId { get; set; }
        public string WebUserUniqueId { get; set; }
        public byte[] CacheBits { get; set; }
        public System.DateTime LastWrite { get; set; }
    }
}
