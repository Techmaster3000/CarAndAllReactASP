import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
//import { useNavigate } from 'react-router-dom';

const AddEmployeesPage = () => {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeEmail, setEmployeeEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    //const navigate = useNavigate();

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        // Basic validation
        if (!employeeName || !employeeEmail) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('/api/business-subscription/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    employeeName,
                    employeeEmail,
                }),
            });

            if (response.ok) {
                setSuccessMessage('Employee added successfully!');
                // Optionally, clear the fields after successful addition
                setEmployeeName('');
                setEmployeeEmail('');
            } else {
                const data = await response.json();
                setError(data.message || 'Error adding employee.');
            }
        
} catch (error) {
            console.error(error);
            setError('Network error while adding employee.');
        }
    };

    return (
        <div className="container w-100 h-75 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <div className="text display-4 pt-2">Voeg Medewerkers Toe</div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                <form className="w-100 d-flex flex-column justify-content-center align-items-center" onSubmit={handleAddEmployee}>
                    <input
                        type="text"
                        placeholder="Naam Medewerker"
                        className="mx-2 my-1 bg-transparent no-outline text-dark"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="Email Medewerker"
                        className="mx-2 my-1 bg-transparent no-outline text-dark"
                        value={employeeEmail}
                        onChange={(e) => setEmployeeEmail(e.target.value)}
                    />
                    {error && <div className="text-danger mt-2">{error}</div>}
                    {successMessage && <div className="text-success mt-2">{successMessage}</div>}
                    <Button variant="primary" type="submit" size="lg" className="btn mt-3 w-100">Voeg Medewerker Toe</Button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeesPage;