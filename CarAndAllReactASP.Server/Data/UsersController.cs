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

namespace CarAndAllReactASP.Server.Data
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher = new PasswordHasher<User>();

        public UsersController(CarAndAllReactASPDbContext context)
        {
            _context = context;
           
        }

        [HttpGet("GetUserID")]
        public async Task<ActionResult<string>> GetUserID(string email) {
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
        public async Task<IActionResult> ChangeUserInfo(string id, User user)
        {
            
            //edit the user info
            var userToEdit = await _context.Users.FindAsync(id);
            if (userToEdit == null)
            {
                return NotFound();
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

        private bool UserExists(string id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}
