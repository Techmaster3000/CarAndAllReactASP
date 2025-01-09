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
using CarAndAllReactASP.Server.Dto_s;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class ParticuliereVerhuursController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly IEmailSender _emailSender;

        public ParticuliereVerhuursController(CarAndAllReactASPDbContext context, IEmailSender emailSender)
        {
            _context = context;
            _emailSender = emailSender;
        }

        /// <summary>
        /// Gets a list of verhuur DTOs.
        /// </summary>
        /// <returns>A list of verhuur DTOs.</returns>
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

        /// <summary>
        /// Gets a list of all particuliere verhuur.
        /// </summary>
        /// <returns>A list of particuliere verhuur.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParticuliereVerhuur>>> GetParticuliereVerhuur()
        {
            return await _context.ParticuliereVerhuur.ToListAsync();
        }

        /// <summary>
        /// Gets a specific particuliere verhuur by ID.
        /// </summary>
        /// <param name="id">The ID of the particuliere verhuur.</param>
        /// <returns>The particuliere verhuur with the specified ID.</returns>
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

        /// <summary>
        /// Registers the uitgifte of a specific verhuur.
        /// </summary>
        /// <param name="id">The ID of the verhuur to register uitgifte for.</param>
        /// <param name="uitgifteDto">The uitgifte data.</param>
        /// <returns>The updated verhuur.</returns>
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

            if (verhuur.Status != "Approved")
            {
                return BadRequest("Verhuur is niet goedgekeurd en kan niet worden uitgegeven.");
            }

            verhuur.Status = "Uitgegeven";
            verhuur.UitgifteDatum = DateTime.UtcNow;
            verhuur.VerhuurOpmerkingen = uitgifteDto.Opmerkingen;

            if (verhuur.Vehicle != null)
            {
                verhuur.Vehicle.Status = "Verhuurd";
                _context.Vehicles.Update(verhuur.Vehicle);
            }

            _context.ParticuliereVerhuur.Update(verhuur);
            await _context.SaveChangesAsync();

            return Ok(verhuur);
        }

        /// <summary>
        /// Gets a list of particuliere verhuur by user ID.
        /// </summary>
        /// <param name="id">The user ID.</param>
        /// <returns>A list of particuliere verhuur for the specified user.</returns>
        [HttpGet("user/{id}")]
        public async Task<ActionResult<IEnumerable<ParticuliereVerhuur>>> GetParticuliereVerhuurByUser(string id)
        {
            return await _context.ParticuliereVerhuur.Where(p => p.UserID == id).ToListAsync();
        }

        /// <summary>
        /// Updates a specific particuliere verhuur.
        /// </summary>
        /// <param name="id">The ID of the particuliere verhuur to update.</param>
        /// <param name="particuliereVerhuur">The updated particuliere verhuur data.</param>
        /// <returns>No content if successful, or not found if the particuliere verhuur does not exist.</returns>
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

        /// <summary>
        /// Adds a new particuliere verhuur.
        /// </summary>
        /// <param name="particuliereVerhuur">The particuliere verhuur to add.</param>
        /// <returns>The added particuliere verhuur.</returns>
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

        /// <summary>
        /// Deletes a specific particuliere verhuur.
        /// </summary>
        /// <param name="id">The ID of the particuliere verhuur to delete.</param>
        /// <returns>No content if successful, or not found if the particuliere verhuur does not exist.</returns>
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

        /// <summary>
        /// Approves a specific verhuur request.
        /// </summary>
        /// <param name="id">The ID of the verhuur request to approve.</param>
        /// <returns>No content if successful, or not found if the verhuur request does not exist.</returns>
        [HttpPut("Approve/{id}")]
        public async Task<IActionResult> ApproveRequest(int id)
        {
            var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);
            if (particuliereVerhuur == null)
            {
                return NotFound();
            }

            particuliereVerhuur.Status = "Approved";
            particuliereVerhuur.RedenAfwijzing = null;

            _context.Entry(particuliereVerhuur).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await _emailSender.SendEmailAsync(particuliereVerhuur.UserID,
                "Huur aanvraag goedgekeurd",
                "Je huur aanvraag is goedgekeurd.");

            return NoContent();
        }

        /// <summary>
        /// Rejects a specific verhuur request.
        /// </summary>
        /// <param name="id">The ID of the verhuur request to reject.</param>
        /// <param name="redenAfwijzing">The reason for rejection.</param>
        /// <returns>No content if successful, or not found if the verhuur request does not exist.</returns>
        [HttpPut("Reject/{id}")]
        public async Task<IActionResult> RejectRequest(int id, [FromBody] string redenAfwijzing)
        {
            var particuliereVerhuur = await _context.ParticuliereVerhuur.FindAsync(id);
            if (particuliereVerhuur == null)
            {
                return NotFound();
            }

            particuliereVerhuur.Status = "Rejected";
            particuliereVerhuur.RedenAfwijzing = redenAfwijzing;

            _context.Entry(particuliereVerhuur).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            await _emailSender.SendEmailAsync(particuliereVerhuur.UserID,
                "Huur aanvraag afgewezen",
                $"Je huur aanvraag is afgewezen. Reden: {redenAfwijzing}");

            return NoContent();
        }

        /// <summary>
        /// Checks if a particuliere verhuur exists.
        /// </summary>
        /// <param name="id">The ID of the particuliere verhuur to check.</param>
        /// <returns>True if the particuliere verhuur exists, otherwise false.</returns>
        private bool ParticuliereVerhuurExists(int id)
        {
            return _context.ParticuliereVerhuur.Any(e => e.VerhuurID == id);
        }
    }
}
