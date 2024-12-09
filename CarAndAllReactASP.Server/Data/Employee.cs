// Models/Employee.cs
using System.ComponentModel.DataAnnotations;

namespace CarAndAllReactASP.Server.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public string FirstName { get; set; } // Voornaam

        [Required]
        public string LastName { get; set; } // Achternaam

        [Required]
        [EmailAddress]
        public string Email { get; set; } // E-mailadres
    }
}