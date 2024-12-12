using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarAndAllReactASP.Server;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticuliereVerhuursController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly IEmailSender _emailSender;

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
    [HttpPut("Approve/{id}")]
    public async Task<IActionResult> ApproveRequest(int id)
    {
        var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);
        if (particuliereVerhuur == null)
        {
            return NotFound();
        }

        // Wijzig de status naar 'Approved'
        particuliereVerhuur.Status = "Approved";
        particuliereVerhuur.RedenAfwijzing = null; // Geen reden nodig voor goedkeuring

        _context.Entry(particuliereVerhuur).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // Stuur notificatie naar de gebruiker
        await _emailSender.SendEmailAsync(particuliereVerhuur.UserID, 
            "Huur aanvraag goedgekeurd", 
            "Je huur aanvraag is goedgekeurd.");

        return NoContent();
    }

    [HttpPut("Reject/{id}")]
    public async Task<IActionResult> RejectRequest(int id, [FromBody] string redenAfwijzing)
    {
        var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);
        if (particuliereVerhuur == null)
        {
            return NotFound();
        }

        // Wijzig de status naar 'Rejected' en sla de reden op
        particuliereVerhuur.Status = "Rejected";
        particuliereVerhuur.RedenAfwijzing = redenAfwijzing;

        _context.Entry(particuliereVerhuur).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        // Stuur notificatie naar de gebruiker
        await _emailSender.SendEmailAsync(particuliereVerhuur.UserID, 
            "Huur aanvraag afgewezen", 
            $"Je huur aanvraag is afgewezen. Reden: {redenAfwijzing}");

        return NoContent();
    }
    }
}
