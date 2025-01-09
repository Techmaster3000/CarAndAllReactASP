using Microsoft.AspNetCore.Mvc;

namespace CarAndAllReactASP.Server.Data
{
[ApiController]
[Route("api/[controller]")]
public class EmployeeController : ControllerBase
{
    private static List<Employee> Employees = new List<Employee>();

    [HttpGet]
    public IActionResult GetEmployees()
    {
        return Ok(Employees);
    }

    [HttpPost]
    public IActionResult AddEmployee([FromBody] Employee employee)
    {
        //check is employee has a valid email address
        if (!employee.Email.EndsWith("@bedrijf.nl"))
        {
            return BadRequest("Alleen bedrijfse-mailadressen zijn toegestaan.");
        }

        employee.Id = Employees.Count > 0 ? Employees.Max(e => e.Id) + 1 : 1;
        Employees.Add(employee);
        // Notify manager (can be integrated with a real notification service)
        Console.WriteLine($"Medewerker toegevoegd: {employee.Email}");
        return Ok(employee);
    }

    [HttpDelete("{id}")]
    public IActionResult RemoveEmployee(int id)
    {
        var employee = Employees.FirstOrDefault(e => e.Id == id);
        if (employee == null)
        {
            return NotFound("Medewerker niet gevonden.");
        }

        Employees.Remove(employee);
        // Notify manager (can be integrated with a real notification service)
        Console.WriteLine($"Medewerker verwijderd: {employee.Email}");
        return NoContent();
    }
}
}