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
public class RentalRequestsController : ControllerBase
{
    private readonly CarAndAllReactASPDbContext _context;

    public RentalRequestsController(CarAndAllReactASPDbContext context)
    {
        _context = context;
    }

    // Haal alle aanvragen op
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RentalRequest>>> GetRentalRequests()
    {
        return await _context.RentalRequests.ToListAsync();
    }

    // Goedkeuren van een aanvraag
    [HttpPost("{id}/approve")]
    public async Task<IActionResult> ApproveRentalRequest(int id)
    {
        var request = await _context.RentalRequests.FindAsync(id);
        if (request == null)
        {
            return NotFound();
        }

        request.Status = "Approved";
        await _context.SaveChangesAsync();

        // Stuur notificatie of email (voorbeeld)
        // SendNotification(request.CustomerName, "Your request has been approved");

        return NoContent();
    }

    // Afwijzen van een aanvraag met reden
    [HttpPost("{id}/reject")]
    public async Task<IActionResult> RejectRentalRequest(int id, [FromBody] string reason)
    {
        var request = await _context.RentalRequests.FindAsync(id);
        if (request == null)
        {
            return NotFound();
        }

        request.Status = "Rejected";
        request.RejectionReason = reason;
        await _context.SaveChangesAsync();

        // Stuur notificatie of email
        // SendNotification(request.CustomerName, "Your request has been rejected");

        return NoContent();
    }
}
}