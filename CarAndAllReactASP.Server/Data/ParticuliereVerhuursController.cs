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
    public class ParticuliereVerhuursController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;

        public ParticuliereVerhuursController(CarAndAllReactASPDbContext context)
        {
            _context = context;
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
            _context.ParticuliereVerhuur.Add(particuliereVerhuur);
            await _context.SaveChangesAsync();

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
