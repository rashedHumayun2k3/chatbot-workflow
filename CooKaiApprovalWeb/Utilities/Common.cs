using CooKaiApprovalWeb.DbContext;
using CooKaiApprovalWeb.Models;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace CooKaiApprovalWeb.Utilities
{
    public class Common
    {
        public static UserInfo InsertUserIfNotExists(CookaiApprovalDB db, DateTime now, long tenantId, UserOrGroupVM userOrGroupVM)
        {
            var approverUser = db.UserInfoes.FirstOrDefault(x => x.AadObjectId == userOrGroupVM.AadObjectId);
            if (approverUser == null)
            {
                approverUser = new UserInfo
                {
                    Id = Guid.NewGuid(),
                    AadObjectId = userOrGroupVM.AadObjectId,
                    UserPrincipalName = userOrGroupVM.UserPrincipalName,
                    TenantId = tenantId,
                    Name = userOrGroupVM.Name,
                    Created = now
                };
                db.UserInfoes.Add(approverUser);
                db.SaveChanges();
            }

            return approverUser;
        }
        public static async Task<List<UserOrGroupVM>> GetUsersOfGroup(string groupId, string groupName, GraphServiceClient graphClient)
        {
            var userList = new List<UserOrGroupVM>();
            try
            {
                var users = await graphClient.Groups[groupId].Members.Request().GetAsync();

                do
                {
                    foreach (User user in users)
                    {
                        userList.Add(new UserOrGroupVM
                        {
                            AadObjectId = Guid.Parse(user.Id),
                            IsGroup = false,
                            Name = user.DisplayName,
                            UserPrincipalName = user.UserPrincipalName,
                            GroupName = groupName
                        });
                    }
                }
                while (users.NextPageRequest != null && (users = await users.NextPageRequest.GetAsync()).Count > 0);
            }
            catch (Exception ex)
            {
                //logger.Error(ex);

            }
            return userList;
        }
    }
}