using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;


namespace CarAndAllReactASP.Server;

public class User : IdentityUser
{
    public string Naam { get; set; }
    public string Adres { get; set; }
    //set the length to the usual length of a phone number
    
}