using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CarAndAllReactASP.Server;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;
using CarAndAllReactASP.Server.Data;
using Microsoft.AspNetCore.Identity.UI.Services;

namespace CarAndAllReactASP.Tests
{
    public class UsersControllerTests : IDisposable
    {
        private readonly UsersController _controller;
        private readonly CarAndAllReactASPDbContext _context;
        private readonly Mock<UserManager<User>> _userManagerMock;
        private readonly Mock<IEmailSender> _emailSenderMock;

        public UsersControllerTests()
        {
            var options = new DbContextOptionsBuilder<CarAndAllReactASPDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;
            _context = new CarAndAllReactASPDbContext(options);

            _userManagerMock = new Mock<UserManager<User>>(
                new Mock<IUserStore<User>>().Object,
                null, null, null, null, null, null, null, null);

            _emailSenderMock = new Mock<IEmailSender>();

            _controller = new UsersController(_context, _userManagerMock.Object, _emailSenderMock.Object);
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetUser_ValidId_ReturnsUser()
        {
            // Arrange
            var user = new User { Id = "1", Email = "test@example.com", Adres = "Test Road 1", Naam = "Johnny Test", PasswordHash = "TestPassword" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetUser("1");

            // Assert
            Assert.IsType<ActionResult<User>>(result);
            Assert.Equal(user, result.Value);
        }


        [Fact]
        public async Task ChangeUserInfo_ValidId_ChangesUserInfo()
        {
            // Arrange
            var user = new User { Id = "1", Email = "test@example.com", Adres = "Test Road 1", Naam = "Johnny Test", PasswordHash = "oldPasswordHash" };
            _controller.PostUser(user);
            await _context.SaveChangesAsync();
            var expectedAdres = "Test Road 2";
            var expectedNaam = "Jonathan Test";
            var updatedUser = new User { Email = "new@example.com", Adres = "Test Road 2", Naam = "Jonathan Test", PasswordHash = "oldPasswordHash" };

            // Act
            var result = await _controller.ChangeUserInfo("1", updatedUser, null);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var userInDb = await _context.Users.FindAsync("1");
            Assert.Equal("new@example.com", userInDb.Email);
            Assert.Equal(expectedAdres, userInDb.Adres);
            Assert.Equal(expectedNaam, userInDb.Naam);
        }

        [Fact]
        public async Task ChangeUserInfo_InvalidId_ReturnsNotFound()
        {
            // Arrange
            var updatedUser = new User { Id = "1", Email = "new@example.com", Adres = "Test Road 2", Naam = "Jonathan Test", PasswordHash = "newPasswordHash" };

            // Act
            var result = await _controller.ChangeUserInfo("nonexistent", updatedUser, null);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PostUser_CreatesNewUser()
        {
            // Arrange
            var user = new User { Id = "1", Email = "test@example.com", Adres = "Test Road 2", Naam = "Jonathan Test", PasswordHash = "newPasswordHash" };

            // Act
            var result = await _controller.PostUser(user);

            // Assert
            Assert.IsType<CreatedAtActionResult>(result.Result);
            var userInDb = await _context.Users.FindAsync("1");
            Assert.Equal(user, userInDb);
        }

        [Fact]
        public async Task DeleteUser_ValidId_DeletesUser()
        {
            // Arrange
            var user = new User { Id = "1", Email = "test@example.com", Adres = "Test Road 2", Naam = "Jonathan Test", PasswordHash = "newPasswordHash" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteUser("1");

            // Assert
            Assert.IsType<NoContentResult>(result);
            var userInDb = await _context.Users.FindAsync("1");
            Assert.Null(userInDb);
        }

        [Fact]
        public async Task EmailConfirm_ValidUserIdAndCode_ConfirmsEmail()
        {
            // Arrange
            var user = new User { Id = "1", Email = "test@example.com" };
            _userManagerMock.Setup(um => um.FindByIdAsync(It.IsAny<string>())).ReturnsAsync(user);
            _userManagerMock.Setup(um => um.ConfirmEmailAsync(It.IsAny<User>(), It.IsAny<string>())).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _controller.emailConfirm("1", "code");

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task CreateBusinessUser_CreatesNewBusinessUser()
        {
            // Arrange
            var user = new BusinessUser { Id = "1", Email = "test@example.com", Adres = "Test Road 1", PasswordHash = "passwordHash", Naam = "TestBusiness", CompanyName = "TestBusiness", KvkNumber = "12345", IsBusiness = true };

            // Act
            var result = await _controller.CreateBusinessUser(user);

            // Assert
            Assert.IsType<CreatedAtActionResult>(result.Result);
            var userInDb = await _context.BusinessUsers.FindAsync("1");
            Assert.Equal(user, userInDb);
        }
    }
}
