
import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';


const ManageEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        const response = await fetch('/api/Employees');
        const data = await response.json();
        setEmployees(data);
    };

    const addEmployee = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email) {
            setError("Vul alle velden in.");
            return;
        }

        try {
            const response = await fetch('/api/Employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, email }),
            });

            if (response.ok) {
                setFirstName('');
                setLastName('');
                setEmail('');
                fetchEmployees();
            } else {
                setError("Fout bij het toevoegen van de medewerker.");
            }
        } catch (error) {
            console.error(error);
            setError("Netwerkfout.");
        }
    };

    const deleteEmployee = async (id) => {
        if (window.confirm("Weet je zeker dat je deze medewerker wilt verwijderen?")) {
            try {
                const response = await fetch(`/api/Employees/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchEmployees();
                } else {
                    setError("Fout bij het verwijderen van de medewerker.");
                }
            } catch (error) {
                console.error(error);
                setError("Netwerkfout.");
            }
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <h2>Beheer Medewerkers</h2>
            <form onSubmit={addEmployee} className="w-50">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Voornaam"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Achternaam"
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <Button type="submit" className="btn btn-primary">Voeg Medewerker Toe</Button>
            </form>
            {error && <div className="text-danger mt-2">{error}</div>}
            <ul className="list-group mt-3">
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

export default ManageEmployees;