import React from "react";

const EmployeeList = () => {
    const employees = [
        { name: "John", lastName: "Doe", email: "john.doe@example.com" },
        { name: "Jane", lastName: "Smith", email: "jane.smith@example.com" }
    ];
     // Later ophalen via API

    return (
        <div className="container mt-5">
            <h2>Employee List</h2>
            {employees.length === 0 ? (
                <p>No employees added yet.</p>
            ) : (
                <ul className="list-group">
                    {employees.map((employee, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {employee.name} {employee.lastName} ({employee.email})
                            <button className="btn btn-danger btn-sm">Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default EmployeeList;
