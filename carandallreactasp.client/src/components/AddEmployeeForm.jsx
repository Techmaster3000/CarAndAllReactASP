

// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api';

const AddEmployeeForm = () => {
    const { companyId } = useParams(); // Haal companyId op uit de URL
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        try {
            await axios.post(`/companies/${companyId}/employees`, employee);
            setSuccess(true);
            setEmployee({ name: '', email: '' }); // Reset formulier
        } catch (error) {
            console.error('Fout bij het toevoegen van de medewerker:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Medewerker Toevoegen</h2>
            {success && <p style={{ color: 'green' }}>Medewerker succesvol toegevoegd!</p>}

            <div>
                <label>Naam:</label>
                <input
                    type="text"
                    name="name"
                    value={employee.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>E-mail:</label>
                <input
                    type="email"
                    name="email"
                    value={employee.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Toevoegen...' : 'Toevoegen'}
            </button>
        </form>
    );
};

export default AddEmployeeForm;
