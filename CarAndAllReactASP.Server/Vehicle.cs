using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace CarAndAllReactASP.Server
{
    public class Vehicle
    {
        [Key]
        public int Id { get; set; }
        //soort must be one of the following: camper, auto or caravan
        [Required]
        public string Soort { get; set; }
        public string Merk { get; set; }
        public string Type { get; set; }
        public string Kleur { get; set; }
        public string Kenteken { get; set; }
        [Range(1900, 2025)]
        public int Aanschafjaar { get; set; }
        public string Opmerkingen { get; set; }
        //make sure the price is in the right format
        [Range(0, 1000000)]
        public double PrijsPerDag { get; set; }
        public string Status { get; set; } // "Beschikbaar", "Teruggebracht", "Met schade", "Verhuurd"

        [JsonIgnore]
        public List<ParticuliereVerhuur> ParticuliereVerhuren { get; set; } = new List<ParticuliereVerhuur>();



    }
}
