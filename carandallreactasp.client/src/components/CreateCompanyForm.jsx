import React, { useState } from 'react';
import axios from '../services/api';

const CreateCompanyForm = ({ onCompanyCreated }) => {
    const [company, setCompany] = useState({
        name: '',
        address: '',
        kvkNumber: '',
        subscriptionType: 'pay-as-you-go',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompany({ ...company, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/companies', company);
            const { id } = response.data; // Zorg dat je API het aangemaakte companyId teruggeeft
            onCompanyCreated(id); // Geef het companyId terug aan App
            alert('Bedrijf succesvol aangemaakt!');
        } catch (error) {
            console.error(error);
            alert('Er is iets misgegaan bij het aanmaken van het bedrijf.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Bedrijf Aanmaken</h2>
            <div>
                <label>Bedrijfsnaam:</label>
                <input
                    type="text"
                    name="name"
                    value={company.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Adres:</label>
                <input
                    type="text"
                    name="address"
                    value={company.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>KVK-nummer:</label>
                <input
                    type="text"
                    name="kvkNumber"
                    value={company.kvkNumber}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>Abonnementstype:</label>
                <select
                    name="subscriptionType"
                    value={company.subscriptionType}
                    onChange={handleChange}
                >
                    <option value="pay-as-you-go">Pay-as-you-go</option>
                    <option value="prepaid">Prepaid</option>
                </select>
            </div>
            <button type="submit" disabled={loading}>
                {loading ? 'Bezig met opslaan...' : 'Bedrijf Aanmaken'}
            </button>
        </form>
    );
};

export default CreateCompanyForm;
