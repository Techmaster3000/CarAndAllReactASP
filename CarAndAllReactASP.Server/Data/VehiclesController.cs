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


        // GET: api/Vehicles
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetVehicles()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // GET: api/Vehicles/5
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
        [HttpGet("GetAvailable")]
        public async Task<ActionResult<IEnumerable<Vehicle>>> GetAvailableCars(DateTime startDatum, DateTime eindDatum)
        {
            //get all the cars that are not rented out in the given period
            var rentedCars = await _context.ParticuliereVerhuur
                .Where(p => p.StartDatum <= eindDatum && p.EindDatum >= startDatum)
                .Select(p => p.VoertuigID)
                .ToListAsync();
            var availableCars = await _context.Vehicles
                .Where(v => !rentedCars.Contains(v.Id))
                .ToListAsync();
            return availableCars;
        }

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



        // PUT: api/Vehicles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
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

        [HttpPost("Inname/{vehicleId}")]
        public async Task<IActionResult> RegisterInname(int vehicleId, [FromBody] InnameDTO innameData)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null)
            {
                return NotFound("Voertuig niet gevonden.");
            }

            vehicle.Status = innameData.Status;
            _context.Entry(vehicle).State = EntityState.Modified;

            if (innameData.HasDamage)
            {
                var damage = new Schade
                {
                    VehicleId = vehicleId,
                    Opmerkingen = innameData.Opmerkingen,
                    FotoUrl = innameData.FotoUrl // 
                };
                _context.Schades.Add(damage);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Inname succesvol geregistreerd." });
        }

        // POST: api/Vehicles
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Vehicle>> PostVehicle(Vehicle vehicle)
        {
            //check if kenteken is already present in the database
            if (_context.Vehicles.Any(e => e.Kenteken == vehicle.Kenteken))
            {
                return Conflict("Kenteken is already present in the database");
            }

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetVehicle", new { id = vehicle.Id }, vehicle);
        }

        // DELETE: api/Vehicles/5
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

        private bool VehicleExists(int id)
        {
            return _context.Vehicles.Any(e => e.Id == id);
        }
    }
}
