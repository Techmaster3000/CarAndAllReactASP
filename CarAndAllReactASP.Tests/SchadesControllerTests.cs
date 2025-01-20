using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using CarAndAllReactASP.Server.Data;
using CarAndAllReactASP.Server;

// Testen bij nieuwe schade toevoegen: kenteken niet bestaat of kenteken wel bestaat

namespace CarAndAllReactASP.Tests
{
    public class SchadesControllerTests
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly SchadesController _controller;

        public SchadesControllerTests()
        {
            // InMemory database setup
            var options = new DbContextOptionsBuilder<CarAndAllReactASPDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase1")
                .Options;

            _context = new CarAndAllReactASPDbContext(options);
            _controller = new SchadesController(_context);

            // Ensure the database is cleared before seeding data
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }
        private void SeedData()
        {
            // Reset de database-inhoud
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            // Voeg testdata toe
            var voertuig = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",          
                Soort = "Auto"   
            };

            _context.Vehicles.Add(voertuig);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GeenVoertuig()
        {
            // Arrange
            var voertuig = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            _context.Vehicles.Add(voertuig);
            _context.SaveChanges();
            var dto = new SchadesController.SchadeclaimDTO
            {
                Kenteken = "YY-999-YY", // Kenteken dat niet bestaat
                Beschrijving = "Nieuwe schade",
                FotoUrl = "url/to/foto"
            };

            // Act
            var result = await _controller.AddSchadeClaim(dto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Voertuig met opgegeven kenteken niet gevonden.", notFoundResult.Value);
        }

        [Fact]
        public async Task WelVoertuig()
        {
            // Arrange
            var voertuig = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            _context.Vehicles.Add(voertuig);
            _context.SaveChanges();
            var dto = new SchadesController.SchadeclaimDTO
            {
                Kenteken = "XX-123-XX", // Bestaand kenteken
                Beschrijving = "Kras op deur",
                FotoUrl = "url/to/kras-foto"
            };

            // Act
            var result = await _controller.AddSchadeClaim(dto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Schadeclaim succesvol toegevoegd", okResult.Value.ToString());

            // Controleer of de schade is toegevoegd in de database
            var schades = _context.Schades.Where(s => s.VehicleId == 1).ToList();
            Assert.Single(schades);

            var schade = schades.First();
            Assert.Equal("Kras op deur", schade.Opmerkingen);
            Assert.Equal("url/to/kras-foto", schade.FotoUrl);
            Assert.Equal("Nieuw", schade.Status);
            Assert.Equal(1, schade.VehicleId);

            // Controleer of de voertuigstatus is bijgewerkt
            var voertuigFind = await _context.Vehicles.FindAsync(1);
            Assert.Equal("In reparatie", voertuigFind.Status);
        }

        [Fact]
        public async Task MeerdereSchades()
        {
            // Arrange
            var voertuig = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };
            _context.Vehicles.Add(voertuig);
            _context.SaveChanges();

            var dto1 = new SchadesController.SchadeclaimDTO
            {
                Kenteken = "XX-123-XX", // Bestaand kenteken
                Beschrijving = "Deuk in bumper",
                FotoUrl = "url/to/deuk-foto"
            };

            var dto2 = new SchadesController.SchadeclaimDTO
            {
                Kenteken = "XX-123-XX", // Bestaand kenteken
                Beschrijving = "Kras op deur",
                FotoUrl = "url/to/kras-foto"
            };

            // Act
            await _controller.AddSchadeClaim(dto1);
            await _controller.AddSchadeClaim(dto2);

            // Assert
            var schades = _context.Schades.Where(s => s.VehicleId == 1).ToList();
            Assert.Equal(2, schades.Count);
            Assert.Contains(schades, s => s.Opmerkingen == "Deuk in bumper");
            Assert.Contains(schades, s => s.Opmerkingen == "Kras op deur");
        }
    }
}
