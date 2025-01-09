using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarAndAllReactASP.Server;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehiclesController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;

        public VehiclesController(CarAndAllReactASPDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Gets the list of all vehicles.
        /// </summary>
        /// <returns>A list of vehicles.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }

        /// <summary>
        /// Gets the list of available vehicles.
        /// </summary>
        /// <returns>A list of available vehicles.</returns>
        [HttpGet("Beschikbaar")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetBeschikbareVehicles()
        {
            return await _context.Vehicles
                .Where(v => v.Status == "Beschikbaar")
                .ToListAsync();
        }

        /// <summary>
        /// Gets a specific vehicle by ID.
        /// </summary>
        /// <param name="id">The ID of the vehicle.</param>
        /// <returns>The vehicle with the specified ID.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Vehicle>> GetVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
            {
                return NotFound();
            }

            return vehicle;
        }

        /// <summary>
        /// Gets the list of available cars for a given period.
        /// </summary>
        /// <param name="startDatum">The start date of the period.</param>
        /// <param name="eindDatum">The end date of the period.</param>
        /// <returns>A list of available cars for the given period.</returns>
        [HttpGet("GetAvailable")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAvailableCars(DateTime startDatum, DateTime eindDatum)
        {
            var rentedCars = await _context.ParticuliereVerhuur
                .Where(p => p.StartDatum <= eindDatum && p.EindDatum >= startDatum)
                .Select(p => p.VoertuigID)
                .ToListAsync();
            var availableCars = await _context.Vehicles
                .Where(v => !rentedCars.Contains(v.Id) && v.Status == "Beschikbaar")
                .ToListAsync();
            return availableCars;
        }

        /// <summary>
        /// Gets the list of vehicles available for inname.
        /// </summary>
        /// <returns>A list of vehicles available for inname.</returns>
        [HttpGet("VoorInname")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehiclesForInname()
        {
            var voertuigenVoorInname = await _context.Vehicles
                .Include(v => v.ParticuliereVerhuren)
                .Where(v => v.Status == "Verhuurd")
                .ToListAsync();

            if (!voertuigenVoorInname.Any())
            {
                return NotFound(new { message = "Geen voertuigen beschikbaar voor inname." });
            }

            return Ok(voertuigenVoorInname);
        }

        /// <summary>
        /// Updates a specific vehicle.
        /// </summary>
        /// <param name="id">The ID of the vehicle to update.</param>
        /// <param name="vehicle">The updated vehicle data.</param>
        /// <returns>No content if successful, or not found if the vehicle does not exist.</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVehicle(int id, Vehicle vehicle)
        {
            if (id != vehicle.Id)
            {
                return BadRequest();
            }

            _context.Entry(vehicle).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehicleExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Registers the inname of a specific vehicle.
        /// </summary>
        /// <param name="vehicleId">The ID of the vehicle to register inname for.</param>
        /// <param name="innameData">The inname data.</param>
        /// <returns>A message indicating the result of the registration.</returns>
        [HttpPost("Inname/{vehicleId}")]
        public async Task<IActionResult> RegisterInname(int vehicleId, [FromBody] InnameDTO innameData)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            vehicle.Status = innameData.HasDamage ? "Met schade" : "Beschikbaar";
            _context.Entry(vehicle).State = EntityState.Modified;

            if (innameData.HasDamage)
            {
                var damage = new Schade
                {
                    VehicleId = vehicleId,
                    Opmerkingen = innameData.Opmerkingen,
                    FotoUrl = innameData.FotoUrl
                };
                _context.Schades.Add(damage);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Inname succesvol geregistreerd." });
        }

        /// <summary>
        /// Blocks a specific vehicle.
        /// </summary>
        /// <param name="id">The ID of the vehicle to block.</param>
        /// <param name="reden">The reason for blocking the vehicle.</param>
        /// <returns>A message indicating the result of the blocking.</returns>
        [HttpPut("{id}/Blokkeer")]
        public async Task<IActionResult> BlokkeerVoertuig(int id, [FromBody] string reden)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            vehicle.Status = "Geblokkeerd";
            vehicle.Opmerkingen = reden;
            _context.Entry(vehicle).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Voertuig succesvol geblokkeerd." });
        }

        /// <summary>
        /// Unblocks a specific vehicle.
        /// </summary>
        /// <param name="id">The ID of the vehicle to unblock.</param>
        /// <returns>A message indicating the result of the unblocking.</returns>
        [HttpPut("{id}/Deblokkeer")]
        public async Task<IActionResult> DeblokkeerVoertuig(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            vehicle.Status = "Beschikbaar";
            vehicle.Opmerkingen = null;
            _context.Entry(vehicle).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Voertuig succesvol gedeblokkeerd." });
        }

        /// <summary>
        /// Adds a new vehicle.
        /// </summary>
        /// <param name="vehicle">The vehicle to add.</param>
        /// <returns>The added vehicle.</returns>
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(Vehicle vehicle)
        {
            if (_context.Vehicles.Any(e => e.Kenteken == vehicle.Kenteken))
            {
                return Conflict("Kenteken is already present in the database");
            }

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicle", new { id = vehicle.Id }, vehicle);
        }

        /// <summary>
        /// Deletes a specific vehicle.
        /// </summary>
        /// <param name="id">The ID of the vehicle to delete.</param>
        /// <returns>No content if successful, or not found if the vehicle does not exist.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return NotFound();
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Checks if a vehicle exists.
        /// </summary>
        /// <param name="id">The ID of the vehicle to check.</param>
        /// <returns>True if the vehicle exists, otherwise false.</returns>
        private bool VehicleExists(int id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }
    }
}
