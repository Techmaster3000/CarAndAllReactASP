using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarAndAllReactASP.Server;
using CarAndAllReactASP.Server.Data;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNetCore.Identity;
using System.Runtime.Intrinsics.X86;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Options;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly IPasswordHasher<Microsoft.AspNetCore.Identity.IdentityUser> _passwordHasher = new PasswordHasher<Microsoft.AspNetCore.Identity.IdentityUser>();
        private readonly UserManager<User> _userManager;
        private readonly IEmailSender _emailSender;

        public UsersController(CarAndAllReactASPDbContext context, UserManager<User> userManager, IEmailSender emailSender)
        {
            _context = context;
            _userManager = userManager;
            _emailSender = emailSender;

        }

        [HttpGet("GetUserID")]
        public async Task<ActionResult<string>> GetUserID(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.NormalizedEmail == email.ToUpper());
            if (user == null)
            {
                return NotFound();
            }
            return user.Id;


        }
        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUser()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }
        [HttpPost("ChangeUserInfo")]
        public async Task<IActionResult> ChangeUserInfo(string id, User user, string? oldPassword)
        {

            //edit the user info
            var userToEdit = await _context.Users.FindAsync(id);
            if (userToEdit == null)
            {
                return NotFound();
            }

            if (oldPassword != null)
            {
                if (userToEdit.PasswordHash != _passwordHasher.HashPassword(user, oldPassword))
                {
                    return BadRequest("Old password is incorrect.");
                }
            }

            userToEdit.Naam = user.Naam;
            userToEdit.NormalizedEmail = user.NormalizedEmail;
            userToEdit.PhoneNumber = user.PhoneNumber;
            userToEdit.Email = user.Email;
            userToEdit.NormalizedUserName = user.NormalizedUserName;
            userToEdit.Adres = user.Adres;
            userToEdit.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(string id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpPost("SendConfirmationEmail")]
        public async Task<IActionResult> SendConfirmEmail(string emailToFind)
        {
            // Get the user by email
            var user = await _userManager.FindByEmailAsync(emailToFind);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Generate the email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            if (string.IsNullOrEmpty(token))
            {
                return StatusCode(StatusCodes.Status204NoContent, "Failed to generate confirmation token.");
            }
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            // Generate the confirmation link

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var confirmationLink = $"{baseUrl}/emailConfirm?userId={user.Id}&code={token}";

            // Send the confirmation email
            try
            {
                await _emailSender.SendEmailAsync(user.Email, "Confirm your email", $"Please confirm your account by <a href='{HtmlEncoder.Default.Encode(confirmationLink)}'>clicking here</a>");
            }
            catch (Exception ex)
            {
                // Log the exception (not shown here)
                return StatusCode(StatusCodes.Status500InternalServerError, "Error sending confirmation email.");
            }

            return Ok();
        }
        [HttpGet("emailConfirm")]
        public async Task<IActionResult> emailConfirm(string userId, string code)
        {
            if (userId == null || code == null)
            {
                return BadRequest("User ID and code are required.");
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, code);
            if (result.Succeeded)
            {
                return Ok("Email confirmed successfully!");
            }
            else
            {
                return BadRequest("Error confirming email.");
            }
        }
        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [HttpPost("createbusinessuser")]
        public async Task<ActionResult<BusinessUser>> CreateBusinessUser(BusinessUser user)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, user.PasswordHash);
            user.IsBusiness = true; // Set this if it's a business account

            _context.BusinessUsers.Add(user);
            await _context.SaveChangesAsync();

            // Send confirmation email
            await SendConfirmEmail(user.Email);

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }
    }
}
