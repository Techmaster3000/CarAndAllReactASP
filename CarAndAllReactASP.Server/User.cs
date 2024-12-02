using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;


namespace CarAndAllReactASP.Server;

public class User : IdentityUser
{
    [Key]
    public int KlantId { get; set; }
    public string Naam { get; set; }
    public string Adres { get; set; }
    public string Email { get; set; }
    //set the length to the usual length of a phone number
    [MinLength(8)]
    [MaxLength(12)]
    public string Telefoonnr { get; set; }




}