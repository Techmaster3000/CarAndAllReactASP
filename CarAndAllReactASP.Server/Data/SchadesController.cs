using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchadesController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;

        public SchadesController(CarAndAllReactASPDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets a list of all schades with vehicle details.
        /// </summary>
        /// <returns>A list of schades with vehicle details.</returns>
        [HttpGet]
        public async Task<IActionResult> GetSchades1()
        {
            var schades = await _context.Schades
                .Include(s => s.Vehicle)
                .Select(s => new
                {
                    s.Id,
                    s.Opmerkingen,
                    s.FotoUrl,
                    s.Datum,
                    s.Status,
                    s.ReparatieOpmerkingen,
                    Vehicle = new
                    {
                        s.Vehicle.Id,
                        s.Vehicle.Merk,
                        s.Vehicle.Type,
                        s.Vehicle.Kenteken
                    }
                })
                .ToListAsync();

            return Ok(schades);
        }

        /// <summary>
        /// Updates the status of a specific schade.
        /// </summary>
        /// <param name="id">The ID of the schade to update.</param>
        /// <param name="status">The new status of the schade.</param>
        /// <returns>A message indicating the result of the update.</returns>
        [HttpPut("{id}/Status")]
        public async Task<IActionResult> UpdateSchadeStatus(int id, [FromBody] string status)
        {
            var schade = await _context.Schades.Include(s => s.Vehicle).FirstOrDefaultAsync(s => s.Id == id);
            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            schade.Status = status;
            string message = "Status succesvol bijgewerkt.";

            if (status == "Afgehandeld" && schade.Vehicle != null)
            {
                // Voertuigstatus aanpassen naar Beschikbaar
                schade.Vehicle.Status = "Beschikbaar";
                _context.Entry(schade.Vehicle).State = EntityState.Modified;
                message += " En voertuig beschikbaar gesteld.";
            }

            _context.Entry(schade).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message });
        }

        /// <summary>
        /// Adds a reparatie opmerking to a specific schade.
        /// </summary>
        /// <param name="id">The ID of the schade to add the opmerking to.</param>
        /// <param name="opmerking">The opmerking to add.</param>
        /// <returns>A message indicating the result of the addition.</returns>
        [HttpPost("{id}/Opmerkingen")]
        public async Task<IActionResult> AddReparatieOpmerking(int id, [FromBody] string opmerking)
        {
            var schade = await _context.Schades.FindAsync(id);
            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            schade.ReparatieOpmerkingen += $"\n{DateTime.UtcNow}: {opmerking}";
            _context.Entry(schade).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Opmerking succesvol toegevoegd." });
        }

        /// <summary>
        /// Gets a list of vehicles with new schades.
        /// </summary>
        /// <returns>A list of vehicles with new schades.</returns>
        [HttpGet("Schades")]
        public async Task<IActionResult> GetSchades()
        {
            var vehiclesWithDamage = await _context.Vehicles
                .Include(v => v.Schades)
                .Where(v => v.Schades.Any(s => s.Status == "Nieuw")) // Filter alleen nieuwe schades
                .Select(v => new
                {
                    VehicleId = v.Id,
                    v.Merk,
                    v.Type,
                    v.Kenteken,
                    v.Status,
                    Schades = v.Schades
                        .Select(s => new
                        {
                            s.Id,
                            s.Opmerkingen,
                            s.FotoUrl,
                            s.Datum,
                            s.Status
                        })
                        .ToList()
                })
                .ToListAsync();

            if (!vehiclesWithDamage.Any())
            {
                return NotFound(new { message = "Geen voertuigen met nieuwe schademeldingen gevonden." });
            }

            return Ok(vehiclesWithDamage);
        }

        /// <summary>
        /// Updates the status of a specific vehicle.
        /// </summary>
        /// <param name="vehicleId">The ID of the vehicle to update.</param>
        /// <param name="newStatus">The new status of the vehicle.</param>
        /// <returns>A message indicating the result of the update.</returns>
        [HttpPut("VoertuigStatus/{vehicleId}")]
        public async Task<IActionResult> UpdateVehicleStatus(int vehicleId, [FromBody] string newStatus)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            vehicle.Status = newStatus;
            _context.Entry(vehicle).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Voertuigstatus succesvol bijgewerkt." });
        }

        /// <summary>
        /// Adds a comment to a specific schade.
        /// </summary>
        /// <param name="schadeId">The ID of the schade to add the comment to.</param>
        /// <param name="comment">The comment to add.</param>
        /// <returns>A message indicating the result of the addition.</returns>
        [HttpPost("Schade/{schadeId}/Opmerkingen")]
        public async Task<IActionResult> AddSchadeComment(int schadeId, [FromBody] string comment)
        {
            var schade = await _context.Schades.FindAsync(schadeId);
            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            schade.Opmerkingen += $"\n{DateTime.UtcNow}: {comment}";
            _context.Entry(schade).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Opmerking succesvol toegevoegd." });
        }

        /// <summary>
        /// Links a reparatie to a specific schade.
        /// </summary>
        /// <param name="id">The ID of the schade to link the reparatie to.</param>
        /// <param name="reparatieDetails">The details of the reparatie.</param>
        /// <returns>A message indicating the result of the linking.</returns>
        [HttpPut("{id}/KoppelReparatie")]
        public async Task<IActionResult> KoppelReparatieAanSchade(int id, [FromBody] string reparatieDetails)
        {
            var schade = await _context.Schades.FindAsync(id);
            if (schade == null)
            {
                return NotFound("Schade niet gevonden.");
            }

            schade.ReparatieOpmerkingen += $"\n{DateTime.UtcNow}: {reparatieDetails}";
            schade.Status = "In behandeling"; // Optioneel: Schade direct naar 'In behandeling' zetten
            _context.Entry(schade).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Reparatie succesvol gekoppeld aan schade." });
        }

        /// <summary>
        /// Gets a list of available reparaties.
        /// </summary>
        /// <returns>A list of available reparaties.</returns>
        [HttpGet("BeschikbareReparaties")]
        public async Task<IActionResult> GetBeschikbareReparaties()
        {
            var reparaties = await _context.Schades
                .Where(s => s.Status == "Nieuw" || s.Status == "In behandeling")
                .Include(s => s.Vehicle)
                .Select(s => new
                {
                    s.Id,
                    s.Opmerkingen,
                    s.Status,
                    Vehicle = new
                    {
                        s.Vehicle.Merk,
                        s.Vehicle.Type,
                        s.Vehicle.Kenteken
                    }
                })
                .ToListAsync();

            if (!reparaties.Any())
            {
                return NotFound(new { message = "Geen beschikbare reparaties gevonden." });
            }

            return Ok(reparaties);
        }

        /// <summary>
        /// Adds a new schade claim.
        /// </summary>
        /// <param name="schadeclaimDTO">The schade claim details.</param>
        /// <returns>A message indicating the result of the addition.</returns>
        [HttpPost("AddClaim")]
        public async Task<IActionResult> AddSchadeClaim([FromBody] SchadeclaimDTO schadeclaimDTO)
        {
            // Zoek het voertuig op basis van het kenteken
            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Kenteken == schadeclaimDTO.Kenteken);
            if (vehicle == null)
            {
                return NotFound("Voertuig met opgegeven kenteken niet gevonden.");
            }

            var schadeclaim = new Schade
            {
                VehicleId = vehicle.Id,
                Opmerkingen = schadeclaimDTO.Beschrijving,
                FotoUrl = schadeclaimDTO.FotoUrl,
                Datum = DateTime.UtcNow,
                Status = "Nieuw"
            };

            _context.Schades.Add(schadeclaim);
            vehicle.Status = "In reparatie";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Schadeclaim succesvol toegevoegd en Voertuigstatus op in reparatie gezet" });
        }

        /// <summary>
        /// DTO for schade claim.
        /// </summary>
        public class SchadeclaimDTO
        {
            public string Kenteken { get; set; } // Vervangt VehicleId
            public string Beschrijving { get; set; }
            public string FotoUrl { get; set; }
        }
    }
}
