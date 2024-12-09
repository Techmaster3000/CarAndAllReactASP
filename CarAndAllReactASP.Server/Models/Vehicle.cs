using System.ComponentModel.DataAnnotations;

namespace CarAndAllReactASP.Server.Models
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Brand { get; set; }

        [Required]
        [MaxLength(100)]
        public string Model { get; set; }

        [Required]
        public string LicensePlate { get; set; }

        [Required]
        public string Color { get; set; }

        [Required]
        public int Year { get; set; }

        public bool IsAvailable { get; set; } = true;
    }
}
