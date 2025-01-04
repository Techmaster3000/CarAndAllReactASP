using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarAndAllReactASP.Server
{
    public class Schade
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int VehicleId { get; set; }
        [ForeignKey("VehicleId")]
        public Vehicle Vehicle { get; set; }

        public string Opmerkingen { get; set; }
        public string? FotoUrl { get; set; }
        [Required]
        public DateTime Datum { get; set; } = DateTime.Now;

        // Nieuw: Status van de schade of claim
        [Required]
        public string Status { get; set; } = "Nieuw"; // "Nieuw", "In behandeling", "Afgehandeld"

        // Nieuw: Opmerkingen over reparaties of onderhoud
        public string? ReparatieOpmerkingen { get; set; }
    }

}
