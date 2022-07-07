using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CooKaiApprovalWeb.Utilities
{
    public static class ExtensionMethods
    {
        public static string ToUTCStr(this DateTime dateTime)
        {
            return dateTime.ToString("s") + "Z";
        }
    }
}