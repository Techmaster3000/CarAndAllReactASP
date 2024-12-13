public class InnameDTO
{
    public string Status { get; set; } // "Teruggebracht" of "Met schade"
    public bool HasDamage { get; set; } 
    public string Opmerkingen { get; set; } 
    public string? FotoUrl { get; set; } // Optioneel (pad naar foto)
}
