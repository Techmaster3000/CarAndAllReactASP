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

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            
            builder.Entity<Vehicle>().HasData(
                new Vehicle { Id = 1, Brand = "Toyota", Model = "Corolla", LicensePlate = "AB-123-CD", Color = "Red", Year = 2018, IsAvailable = true },
                new Vehicle { Id = 2, Brand = "Ford", Model = "Focus", LicensePlate = "EF-456-GH", Color = "Blue", Year = 2019, IsAvailable = true }
            );
        }

        
        public DbSet<Vehicle> Vehicles { get; set; }
    }
}
