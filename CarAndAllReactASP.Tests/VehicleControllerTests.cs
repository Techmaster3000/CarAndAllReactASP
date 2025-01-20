using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using CarAndAllReactASP.Server.Data;
using CarAndAllReactASP.Server;
//Test voor inname voertuigen
namespace CarAndAllReactASP.Tests
{
    public class VoertuigenControllerTests
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly VehiclesController _controller;

        public VoertuigenControllerTests()
        {
            // InMemory database setup
            var options = new DbContextOptionsBuilder<CarAndAllReactASPDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase2")
                .Options;

            _context = new CarAndAllReactASPDbContext(options);
            _controller = new VehiclesController(_context);

            // Ensure the database is cleared before seeding data
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        private void SeedData()
        {
            // Voeg testdata toe aan de InMemory-database
            var voertuig1 = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            _context.Vehicles.Add(voertuig1);
            _context.SaveChanges();
        }

        [Fact]
        public async Task GeenVoertuig()
        {
            // Arrange
            var voertuig1 = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            _context.Vehicles.Add(voertuig1);
            _context.SaveChanges();
            var innameData = new InnameDTO
            {
                HasDamage = false,
                Opmerkingen = null,
                FotoUrl = null
            };

            // Act
            var result = await _controller.RegisterInname(99, innameData); // VehicleId 99 bestaat niet

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Voertuig niet gevonden.", notFoundResult.Value);
        }

        [Fact]
        public async Task GeenSchade()
        {
            // Arrange
            var voertuig1 = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            _context.Vehicles.Add(voertuig1);
            _context.SaveChanges();
            var innameData = new InnameDTO
            {
                HasDamage = false,
                Opmerkingen = null,
                FotoUrl = null
            };

            // Act
            var result = await _controller.RegisterInname(1, innameData); // VehicleId 1 bestaat

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Inname succesvol geregistreerd.", okResult.Value.ToString());

            // Controleer dat de voertuigstatus is gewijzigd
            var voertuig = await _context.Vehicles.FindAsync(1);
            Assert.Equal("Beschikbaar", voertuig.Status);

            // Controleer dat er geen schade is toegevoegd
            var schades = _context.Schades.Where(s => s.VehicleId == 1).ToList();
            Assert.Empty(schades);
        }

        [Fact]
        public async Task MetSchade()
        {
            // Arrange
            var voertuig1 = new Vehicle
            {
                Id = 1,
                Merk = "Toyota",
                Type = "Corolla",
                Kenteken = "XX-123-XX",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };
            _context.Vehicles.Add(voertuig1);
            _context.SaveChanges();
            var innameData = new InnameDTO
            {
                HasDamage = true,
                Opmerkingen = "Deuk in deur",
                FotoUrl = "url/to/deuk-foto"
            };

            // Act
            var result = await _controller.RegisterInname(1, innameData); // VehicleId 1 bestaat

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Contains("Inname succesvol geregistreerd.", okResult.Value.ToString());

            // Controleer dat de voertuigstatus is gewijzigd
            var voertuig = await _context.Vehicles.FindAsync(1);
            Assert.NotNull(voertuig);
            Assert.Equal("Met schade", voertuig.Status);

            // Controleer dat de schade is toegevoegd
            var schades = await _context.Schades.Where(s => s.VehicleId == 1).ToListAsync();
            Assert.Single(schades);

            var schade = schades[0];
            Assert.Equal("Deuk in deur", schade.Opmerkingen);
            Assert.Equal("url/to/deuk-foto", schade.FotoUrl);
        }
    }
}
