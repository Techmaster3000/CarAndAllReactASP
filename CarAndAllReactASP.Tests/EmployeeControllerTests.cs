using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Xunit;
using CarAndAllReactASP.Server.Data;

namespace CarAndAllReactASP.Tests
{
    public class EmployeeControllerTests
    {
        private readonly EmployeeController _controller;

        public EmployeeControllerTests()
        {
            _controller = new EmployeeController();
        }

        [Fact]
        public void AddEmployee_ReturnsBadRequest_WhenEmailIsInvalid()
        {
            // Arrange
            var employee = new Employee
            {
                Email = "invalidemail@gmail.com"
            };

            // Act
            var result = _controller.AddEmployee(employee);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Alleen bedrijfse-mailadressen zijn toegestaan.", badRequestResult.Value);
        }

        [Fact]
        public void GetEmployees_ReturnsListOfEmployees_WhenEmployeesAdded()
        {
            // Arrange
            var employee1 = new Employee
            {
                Email = "employee1@bedrijf.nl"
            };
            var employee2 = new Employee
            {
                Email = "employee2@bedrijf.nl"
            };
            _controller.AddEmployee(employee1);
            _controller.AddEmployee(employee2);

            // Act
            var result = _controller.GetEmployees();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var employees = Assert.IsType<List<Employee>>(okResult.Value);
            Assert.Equal(2, employees.Count);
            Assert.Contains(employees, e => e.Email == "employee1@bedrijf.nl");
            Assert.Contains(employees, e => e.Email == "employee2@bedrijf.nl");
        }
    }
}

