import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const EmployeeList = () => {
    // Hardcoded employees for demonstration
    const [employees, setEmployees] = useState([
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com' },
        { id: 3, firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com' },
    ]);

    const deleteEmployee = (id) => {
        if (window.confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")) {
            setEmployees(employees.filter(employee => employee.id !== id));
        }
    };

    return (
        <div className="container mt-5">
            <h2>Medewerker Lijst</h2>
            <ul className="list-group">
                {employees.map((employee) => (
                    <li key={employee.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {employee.firstName} {employee.lastName} - {employee.email}
                        <Button variant="danger" onClick={() => deleteEmployee(employee.id)}>Verwijder</Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;