using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CarAndAllReactASP.Server.Models;

namespace CarAndAllReactASP.Server.Data
{
    public class CarAndAllReactASPDbContext : IdentityDbContext<User>
    {
        public CarAndAllReactASPDbContext(DbContextOptions<CarAndAllReactASPDbContext> options)
            : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public DbSet<User> Users { get; set; }
    }
}