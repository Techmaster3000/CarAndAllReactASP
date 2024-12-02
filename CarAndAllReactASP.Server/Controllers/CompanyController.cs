using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CarAndAllReactASP.Models;
using CarAndAllReactASP.Services;
using CarAndAllReactASP.Data;
using Microsoft.EntityFrameworkCore;

namespace CarAndAllReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/companies")]
    public class CompanyController : ControllerBase
    {
        private readonly ApplicationDbContext _context; // Voor database-interacties
        private readonly EmailService _emailService;    // Voor e-mails versturen

        public CompanyController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // POST: /api/companies 
        [HttpPost]
        public async Task<IActionResult> CreateCompany([FromBody] Company company)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Opslaan in database
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            // E-mail sturen
            if (!string.IsNullOrEmpty(company.Email))
            {
                await _emailService.SendConfirmationEmail(company.Email, company.Name);
            }

            return CreatedAtAction(nameof(GetCompany), new { id = company.Id }, company);
        }

        // GET: /api/companies/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCompany(int id)
        {
            var company = await _context.Companies.Include(c => c.Employees).FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
                return NotFound();

            return Ok(company);
        }

        // POST: /api/companies/{companyId}/employees
        [HttpPost("{companyId}/employees")]
        public async Task<IActionResult> AddEmployee(int companyId, [FromBody] Employee employee)
        {
            var company = await _context.Companies.FindAsync(companyId);

            if (company == null)
                return NotFound("Bedrijf niet gevonden.");

            employee.CompanyId = companyId;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return Ok(employee);
        }

        // POST: /api/companies/{companyId}/subscription
        [HttpPost("{companyId}/subscription")]
        public async Task<IActionResult> SetSubscriptionType(int companyId, [FromBody] string subscriptionType)
        {
            var company = await _context.Companies.FindAsync(companyId);

            if (company == null)
                return NotFound("Bedrijf niet gevonden.");

            if (string.IsNullOrWhiteSpace(subscriptionType) || 
                (subscriptionType != "pay-as-you-go" && subscriptionType != "prepaid"))
            {
                return BadRequest("Ongeldig abonnementstype.");
            }

            company.SubscriptionType = subscriptionType;
            await _context.SaveChangesAsync();

            return Ok("Abonnementstype bijgewerkt.");
        }
    }
}