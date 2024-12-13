using System.ComponentModel.DataAnnotations;

namespace CarAndAllReactASP.Server
{
    public class Schade
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int VehicleId { get; set; }
        public Vehicle Vehicle { get; set; } 
        public string Opmerkingen { get; set; }
        public string? FotoUrl { get; set; } 
        [Required]
        public DateTime Datum { get; set; } = DateTime.Now; 
    }
}
