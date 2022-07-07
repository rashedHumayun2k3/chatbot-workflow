using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Models
{
    public class RequestAttachmentVM
    {
        public string FileUrl { get; set; }
        public int FileSize { get; set; }
        public string FileName { get; set; }
        public string FileId { get; set; }
        public string Created { get; set; }
        public UserOrGroupVM CreatedBy { get; set; }
        public bool IsDeletable { get; set; }
    }
}