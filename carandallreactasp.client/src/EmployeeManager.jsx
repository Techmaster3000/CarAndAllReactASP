// src/components/EmployeeManager.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EmployeeManager.css"; // CSS file for styling

const EmployeeManager = () => {
    const [employees, setEmployees] = useState([]);
    const [email, setEmail] = useState("");
    const [notification, setNotification] = useState("");
    const [search, setSearch] = useState(""); // State for searching employees

    useEffect(() => {
        // Fetch the list of employees on component mount
        axios.get("/api/employees")
            .then(response => setEmployees(response.data))
            .catch(error => console.error("Error fetching employees:", error));
    }, []);

    const addEmployee = () => {
        if (!email.endsWith("@bedrijf.nl")) {
            setNotification("❌ Alleen bedrijfse-mailadressen zijn toegestaan.");
            return;
        }

        axios.post("/api/employees", { email })
            .then(response => {
                setEmployees([...employees, response.data]);
                setNotification(`✅ Medewerker ${email} toegevoegd.`);
                setEmail("");
            })
            .catch(error => {
                console.error("Error adding employee:", error);
                setNotification("❌ Fout bij het toevoegen van de medewerker.");
            });
    };

    const removeEmployee = (id) => {
        axios.delete(`/api/employees/${id}`)
            .then(() => {
                const removedEmployee = employees.find(emp => emp.id === id);
                setEmployees(employees.filter(emp => emp.id !== id));
                setNotification(`⚠️ Medewerker ${removedEmployee.email} verwijderd.`);
            })
            .catch(error => {
                console.error("Error removing employee:", error);
                setNotification("❌ Fout bij het verwijderen van de medewerker.");
            });
    };

    const filteredEmployees = employees.filter(emp => 
        emp.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="employee-manager">
            <h1>Medewerkersbeheer</h1>

            {notification && <div className="notification">{notification}</div>}

            <div className="form-group">
                <input
                    type="email"
                    placeholder="Voer bedrijfse-mail in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={addEmployee}>Medewerker Toevoegen</button>
            </div>

            <div className="form-group">
                <input
                    type="text"
                    placeholder="Zoek medewerkers"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <ul className="employee-list">
                {filteredEmployees.map(emp => (
                    <li key={emp.id} className="employee-item">
                        {emp.email}
                        <button className="remove-button" onClick={() => removeEmployee(emp.id)}>Verwijderen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeManager;
