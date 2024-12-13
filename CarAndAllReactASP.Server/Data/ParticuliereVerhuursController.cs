using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarAndAllReactASP.Server;
using CarAndAllReactASP.Server.Dto_s;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticuliereVerhuursController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;

        public ParticuliereVerhuursController(CarAndAllReactASPDbContext context)
        {
            _context = context;
        }
        // GET: api/ParticuliereVerhuurs
        [HttpGet("dto")]
        public async Task<ActionResult<IEnumerable<VerhuurDTO>>> GetParticuliereVerhuurdto()
        {
            var huurverzoeken = await _context.ParticuliereVerhuur
                .Include(h => h.Vehicle)
                .Include(h => h.User)
                .Select(h => new VerhuurDTO
                {
                    VerhuurID = h.VerhuurID,
                    Status = h.Status,
                    Voertuig = new VoertuigDTO
                    {
                        Merk = h.Vehicle.Merk,
                        Type = h.Vehicle.Type,
                        Kenteken = h.Vehicle.Kenteken
                    },
                    User = new UserDTO
                    {
                        Naam = h.User.Naam,
                        Email = h.User.Email,
                        PhoneNumber = h.User.PhoneNumber
                    }
                })
                .ToListAsync();

            if (!huurverzoeken.Any())
            {
                return NotFound("Geen huurverzoeken gevonden.");
            }

            return Ok(huurverzoeken);
        }
        // GET: api/ParticuliereVerhuurs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParticuliereVerhuur>>> GetParticuliereVerhuur()
        {
            return await _context.ParticuliereVerhuur.ToListAsync();
        }

            // GET: api/ParticuliereVerhuurs/5
            [HttpGet("{id}")]
            public async Task<ActionResult<ParticuliereVerhuur>> GetParticuliereVerhuur(int id)
        {
            var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);

            if (particuliereVerhuur == null)
            {
                return NotFound();
            }

            return particuliereVerhuur;
        }

        [HttpPut("uitgifte/{id}")]
        public async Task<IActionResult> RegistreerUitgifte(int id, [FromBody] UitgifteDto uitgifteDto)
        {
            var verhuur = await _context.ParticuliereVerhuur
                .Include(v => v.Vehicle) 
                .Include(v => v.User)    
                .FirstOrDefaultAsync(v => v.VerhuurID == id);

            if (verhuur == null)
            {
                return NotFound("Verhuur niet gevonden.");
            }

            if (verhuur.Status != "Goedgekeurd")
            {
                return BadRequest("Verhuur is niet goedgekeurd en kan niet worden uitgegeven.");
            }

            verhuur.Status = "Uitgegeven";
            verhuur.UitgifteDatum = DateTime.UtcNow;
            verhuur.Opmerkingen = uitgifteDto.Opmerkingen;

            _context.ParticuliereVerhuur.Update(verhuur);
            await _context.SaveChangesAsync();

            return Ok(verhuur);
        }
        

        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<ParticuliereVerhuur>>> GetParticuliereVerhuurByUser(string id)
        {
            return await _context.ParticuliereVerhuur.Where(p => p.UserID == id).ToListAsync();
        }
        // PUT: api/ParticuliereVerhuurs/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParticuliereVerhuur(int id, ParticuliereVerhuur particuliereVerhuur)
        {
            if (id != particuliereVerhuur.VerhuurID)
            {
                return BadRequest();
            }

            _context.Entry(particuliereVerhuur).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ParticuliereVerhuurExists(id))
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

        // POST: api/ParticuliereVerhuurs
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ParticuliereVerhuur>> PostParticuliereVerhuur(ParticuliereVerhuur particuliereVerhuur)
        {
            try
            {
                Program.EnableIdentityInsert(_context, "ParticuliereVerhuur", true);
                _context.ParticuliereVerhuur.Add(particuliereVerhuur);
                await _context.SaveChangesAsync();
            }
            finally
            {
                Program.EnableIdentityInsert(_context, "ParticuliereVerhuur", false);
            }

            return CreatedAtAction("GetParticuliereVerhuur", new { id = particuliereVerhuur.VerhuurID }, particuliereVerhuur);
        }

        // DELETE: api/ParticuliereVerhuurs/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParticuliereVerhuur(int id)
        {
            var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);
            if (particuliereVerhuur == null)
            {
                return NotFound();
            }

            _context.ParticuliereVerhuur.Remove(particuliereVerhuur);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ParticuliereVerhuurExists(int id)
        {
            return _context.ParticuliereVerhuur.Any(e => e.VerhuurID == id);
        }
    }
}
