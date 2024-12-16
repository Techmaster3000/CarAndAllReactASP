using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

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

            builder.Entity<ParticuliereVerhuur>()
            .HasOne(p => p.Vehicle)
            .WithMany(v => v.ParticuliereVerhuren) 
            .HasForeignKey(p => p.VoertuigID);

            builder.Entity<User>()
                .HasDiscriminator<string>("Discriminator")
                .HasValue<User>("User")
                .HasValue<BusinessUser>("BusinessUser");


            // Relatie tussen ParticuliereVerhuur en User
            builder.Entity<ParticuliereVerhuur>()
            .HasOne(p => p.User)
            .WithMany() 
            .HasForeignKey(p => p.UserID);

            builder.Entity<Schade>()
            .HasOne(d => d.Vehicle)
            .WithMany() 
            .HasForeignKey(d => d.VehicleId);

            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<BusinessUser> BusinessUsers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ParticuliereVerhuur> ParticuliereVerhuur { get; set; }
        public DbSet<RentalRequest> RentalRequests { get; set; }
        public DbSet<Schade> Schades { get; set; }


    }
}