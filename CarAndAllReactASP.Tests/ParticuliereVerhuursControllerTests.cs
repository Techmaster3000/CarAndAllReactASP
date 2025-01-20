using System;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using Xunit;
using CarAndAllReactASP.Server.Data;
using CarAndAllReactASP.Server;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
//Test voor uitgifte voertuigen
namespace CarAndAllReactASP.Tests
{
    public class ParticuliereVerhuursControllerTests
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly ParticuliereVerhuursController _controller;
        private readonly Mock<IEmailSender> _emailSenderMock;

        public ParticuliereVerhuursControllerTests()
        {
            // InMemory database setup
            var options = new DbContextOptionsBuilder<CarAndAllReactASPDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase3")
                .Options;

            _context = new CarAndAllReactASPDbContext(options);
            _emailSenderMock = new Mock<IEmailSender>();
            _controller = new ParticuliereVerhuursController(_context, _emailSenderMock.Object);

            // Ensure the database is cleared before seeding data
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        private void SeedData()
        {
            var voertuig = new Vehicle
            {
                Id = 1,
                Merk = "Volkswagen",
                Type = "Golf",
                Kenteken = "AB-123-CD",
                Status = "Beschikbaar",
                Kleur = "Blauw",
                Soort = "Auto"
            };

            var user = new User
            {
                Id = "1",
                Naam = "Test User",
                Email = "testuser@example.com",
                Adres = "Test Road 1",
            };

            var verhuur = new ParticuliereVerhuur
            {
                VerhuurID = 1,
                VoertuigID = 1,
                UserID = "1",
                StartDatum = DateTime.UtcNow.AddDays(-2),
                EindDatum = DateTime.UtcNow.AddDays(2),
                Status = "Approved",
                Vehicle = voertuig,
                User = user,
                VoertuigNaam = "Toyota Corlla",
                VoertuigSoort = "Auto"
            };

            _context.Vehicles.Add(voertuig);
            _context.Users.Add(user);
            _context.ParticuliereVerhuur.Add(verhuur);
            _context.SaveChanges();
        }

        [Fact]
        public async Task RegistreerUitgifte_VoertuigNietGevonden()
        {
            // Arrange
            var uitgifteDto = new UitgifteDto
            {
                Opmerkingen = "Geen bijzonderheden"
            };

            // Act
            var result = await _controller.RegistreerUitgifte(99, uitgifteDto); // VerhuurID 99 bestaat niet

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Verhuur niet gevonden.", notFoundResult.Value);
        }


        [Fact]
        public async Task RegistreerUitgifte_SuccesvolleUitgifte()
        {
            // Arrange
            SeedData();

            var uitgifteDto = new UitgifteDto
            {
                Opmerkingen = "Uitgifte succesvol."
            };

            // Act
            var result = await _controller.RegistreerUitgifte(1, uitgifteDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedVerhuur = Assert.IsType<ParticuliereVerhuur>(okResult.Value);

            Assert.Equal("Uitgegeven", updatedVerhuur.Status);
            Assert.Equal("Verhuurd", updatedVerhuur.Vehicle.Status);
            Assert.Equal("Uitgifte succesvol.", updatedVerhuur.VerhuurOpmerkingen);
            Assert.NotNull(updatedVerhuur.UitgifteDatum);
        }

    }
}