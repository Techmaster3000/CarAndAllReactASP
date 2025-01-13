using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;
using CarAndAllReactASP.Server.Data;
using CarAndAllReactASP.Server;

namespace CarAndAllReactASP.Tests
{
    public class RentalRequestsControllerTests : IDisposable
    {
        private readonly CarAndAllReactASPDbContext _context;
        private readonly RentalRequestsController _controller;

        public RentalRequestsControllerTests()
        {
            // InMemory database setup
            var options = new DbContextOptionsBuilder<CarAndAllReactASPDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            _context = new CarAndAllReactASPDbContext(options);
            _controller = new RentalRequestsController(_context);

            // Ensure the database is cleared before seeding data
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();
        }

        private async Task SeedDataAsync()
        {
            var request1 = new RentalRequest
            {
                Id = 1,
                CustomerName = "John Doe",
                RentalItem = "Car",
                RentalDate = DateTime.Now,
                Status = "Pending",
                RejectionReason = "Not available"
            };

            var request2 = new RentalRequest
            {
                Id = 2,
                CustomerName = "Jane Smith",
                RentalItem = "Bike",
                RentalDate = DateTime.Now,
                Status = "Pending",
                RejectionReason = "Not available"
            };

            _context.RentalRequests.AddRange(request1, request2);
            await _context.SaveChangesAsync();
        }

        [Fact]
        public async Task ApproveRentalRequest_ValidId_UpdatesStatus()
        {
            // Arrange
            await SeedDataAsync();

            // Act
            var result = await _controller.ApproveRentalRequest(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var request = await _context.RentalRequests.FindAsync(1);
            Assert.Equal("Approved", request.Status);
        }

        [Fact]
        public async Task RejectRentalRequest_ValidId_UpdatesStatusAndReason()
        {
            // Arrange
            await SeedDataAsync();
            var reason = "Not available";

            // Act
            var result = await _controller.RejectRentalRequest(1, reason);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var request = await _context.RentalRequests.FindAsync(1);
            Assert.Equal("Rejected", request.Status);
            Assert.Equal(reason, request.RejectionReason);
        }

        public void Dispose()
        {
            // Ensure the database is cleared after each test
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}
