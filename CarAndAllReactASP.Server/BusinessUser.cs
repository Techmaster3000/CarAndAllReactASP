using Microsoft.AspNetCore.Identity;

namespace CarAndAllReactASP.Server
{
    public class BusinessUser : User
    {
        public bool IsBusiness { get; set; } // Flag to indicate if the user is a business client
        public string CompanyName { get; set; } // Company name for business clients
        public string KvkNumber { get; set; } // KVK number for business clients

    }
}
