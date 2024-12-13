using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;


namespace CarAndAllReactASP.Server;

public class User : IdentityUser
{
    public string Naam { get; set; }
    public string Adres { get; set; }
    //set the length to the usual length of a phone number
    public bool IsBusiness { get; set; } // Flag to indicate if the user is a business client
    public string CompanyName { get; set; } // Company name for business clients
    public string KvkNumber { get; set; } // KVK number for business clients


}