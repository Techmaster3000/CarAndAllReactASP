﻿using Microsoft.AspNetCore.Identity;
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

            //relatie tussen verhuur en voertuig
            builder.Entity<ParticuliereVerhuur>()
            .HasOne(p => p.Vehicle)
            .WithMany(v => v.ParticuliereVerhuren) 
            .HasForeignKey(p => p.VoertuigID);

            //separate the User and BusinessUser in the Identity User table
            builder.Entity<User>()
                .HasDiscriminator<string>("Discriminator")
                .HasValue<User>("User")
                .HasValue<BusinessUser>("BusinessUser");


            // Relatie tussen ParticuliereVerhuur en User
            builder.Entity<ParticuliereVerhuur>()
            .HasOne(p => p.User)
            .WithMany() 
            .HasForeignKey(p => p.UserID);

            // Relatie tussen Schade en Voertuig
            builder.Entity<Schade>()
            .HasOne(d => d.Vehicle)
            .WithMany(v => v.Schades)
            .HasForeignKey(d => d.VehicleId)
            .OnDelete(DeleteBehavior.Cascade);

        }


        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);

        // Add DbSet for each entity
        public DbSet<User> Users { get; set; }
        public DbSet<BusinessUser> BusinessUsers { get; set; }
        public DbSet<Vehicle> Vehicles { get; set; }
        public DbSet<ParticuliereVerhuur> ParticuliereVerhuur { get; set; }
        public DbSet<RentalRequest> RentalRequests { get; set; }
        public DbSet<Schade> Schades { get; set; }

    }
}