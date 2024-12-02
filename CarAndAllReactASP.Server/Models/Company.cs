using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CarAndAllReactASP.Models{

 public class Company
    {
        [Key]
        public int Id { get; set; } // Uniek bedrijf ID

        [Required]
        public string Name { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public string KvKNumber { get; set; }

        public string SubscriptionType { get; set; } // "pay-as-you-go" of "prepaid"

         public string Email { get; set; }

        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }
}