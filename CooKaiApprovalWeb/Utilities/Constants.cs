using System.Configuration;

namespace CooKaiApprovalWeb.Utilities
{
    public class Constants
    {
        public static string BotAccountPrefix = "28:";
        public static string WebBaseUrl = ConfigurationManager.AppSettings["WebBaseUrl"];
        public static string ApprovedIconUrl = WebBaseUrl+ "Content/custom-icons/cookai_team_icon_accepted.png";
        public static string PendingIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_pending.png";
        public static string RejectedIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_rejected.png";
        public static string DocIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_doc.png";
        public static string JpgIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_jpg.png";
        public static string OtherIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_other.png";
        public static string PdfIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_pdf.png";
        public static string PptIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_ppt.png";
        public static string XlsIconUrl = WebBaseUrl + "Content/custom-icons/cookai_team_icon_xls.png";
        public static string LineImageUrl = WebBaseUrl + "Content/custom-icons/line.png";
        public static int PendingApprovalStatusId = 1;
        public static int ApprovedApprovalStatusId = 2;
        public static int RejectedApprovalStatusId = 3;

    }
}