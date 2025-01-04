using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CarAndAllReactASP.Server
{
    public class ParticuliereVerhuur
    {
        [Key]
        public int VerhuurID { get; set; }

        [Required]
        [ForeignKey("Vehicle")]
        public int VoertuigID { get; set; }
        public Vehicle Vehicle { get; set; }

        public string VoertuigNaam { get; set; }
        public string VoertuigSoort { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserID { get; set; }
        public User User { get; set; } 

        [Column(TypeName = "date")]
        public DateTime StartDatum { get; set; }

        [Column(TypeName = "date")]
        public DateTime EindDatum { get; set; }
        public string Status { get; set; } // "In afwachting", "Approved", "Rejected"

        [Column(TypeName = "date")]
        public DateTime? UitgifteDatum { get; set; }

        public string? VerhuurOpmerkingen { get; set; }
        public double TotaalPrijs { get; set; }
        public string? RedenAfwijzing { get; set; }
    }
}
