import React, { useState, useEffect } from 'react';
import { fetchHuurverzoeken, registreerUitgifte } from './api';
import "./UitgiftePage.css"; 

const UitgiftePage = () => {
    const [huurverzoeken, setHuurverzoeken] = useState([]);
    const [opmerkingen, setOpmerkingen] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const loadHuurverzoeken = async () => {
            try {
                const data = await fetchHuurverzoeken();
                console.log('Gegevens van API:', data);
                setHuurverzoeken(data.filter((h) => h.status === 'Goedgekeurd'));
            } catch (err) {
                setError('Fout bij het ophalen van huurverzoeken: ' + err.message);
            }
        };
        loadHuurverzoeken();
    }, []);

    const handleUitgifte = async (verhuurID) => {
        console.log('VerhuurID:', verhuurID);
        const opmerkingenText = opmerkingen[verhuurID] || '';
        try {
            await registreerUitgifte(verhuurID, { opmerkingen: opmerkingenText });
            setSuccess('Uitgifte succesvol geregistreerd!');
            setHuurverzoeken((prev) =>
                prev.filter((h) => h.verhuurID !== verhuurID)
            );
        } catch (err) {
            setError('Fout bij het registreren van de uitgifte: ' + err.message);
        }
    };

    return (
        <div className="uitgifte-container">
            <h3>Uitgifte van Voertuigen</h3>

            {/* Meldingen */}
            {success && <div className="message success-message">{success}</div>}
            {error && <div className="message error-message">{error}</div>}

            {/* Lijst van huurverzoeken */}
            <ul className="huurverzoek-list">
                {huurverzoeken.map((huurverzoek) => (
                    <li key={huurverzoek.verhuurID} className="huurverzoek-item">
                        <h4>{huurverzoek.voertuig?.merk} {huurverzoek.voertuig?.type}</h4>
                        <p><strong>Kenteken:</strong> {huurverzoek.voertuig?.kenteken}</p>
                        <p><strong>Huurder:</strong> {huurverzoek.user?.naam}</p>

                        {/* Textarea voor opmerkingen */}
                        <textarea
                            value={opmerkingen[huurverzoek.verhuurID] || ''}
                            onChange={(e) => setOpmerkingen({ ...opmerkingen, [huurverzoek.verhuurID]: e.target.value })}
                            placeholder="Eventuele opmerkingen"
                        />

                        <button onClick={() => handleUitgifte(huurverzoek.verhuurID)}>Bevestig Uitgifte</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UitgiftePage;