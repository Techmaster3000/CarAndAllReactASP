using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;


namespace CarAndAllReactASP.Server;
//inherit from IdentityUser. Includes userId, username, password, email, etc.
public class User : IdentityUser
{
    public string Naam { get; set; }
    public string Adres { get; set; }
    
}