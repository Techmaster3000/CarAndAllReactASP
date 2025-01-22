import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

/**
 * CreateCar component handles the creation of a new car.
 * It includes form fields for car details and performs validation
 * before submitting the data to the server.
 */
const CreateCar = () => {
    const [soort, setSoort] = useState('');
    const [merk, setMerk] = useState('');
    const [type, setType] = useState('');
    const [kleur, setKleur] = useState('');
    const [kenteken1, setKenteken1] = useState('');
    const [kenteken2, setKenteken2] = useState('');
    const [kenteken3, setKenteken3] = useState('');
    const [aanschafjaar, setAanschafjaar] = useState('');
    const [prijsPerDag, setPrijsPerDag] = useState('');
    const [opmerking, setOpmerking] = useState('');
    const [error, setError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkFormValidity = () => {
            if (
                soort &&
                merk &&
                type &&
                kleur &&
                kenteken1 &&
                kenteken2 &&
                kenteken3 &&
                aanschafjaar &&
                prijsPerDag
            ) {
                setIsFormValid(true);
            } else {
                setIsFormValid(false);
            }
        };

        checkFormValidity();
    }, [soort, merk, type, kleur, kenteken1, kenteken2, kenteken3, aanschafjaar, prijsPerDag]);

    /**
     * Handles the form submission to create a new car.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        const kenteken = `${kenteken1}-${kenteken2}-${kenteken3}`;
        try {
            const response = await fetch('/api/Vehicles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    soort: soort,
                    merk: merk,
                    type: type,
                    kleur: kleur,
                    kenteken: kenteken,
                    aanschafjaar: aanschafjaar,
                    prijsPerDag: prijsPerDag,
                    opmerkingen: opmerking,
                    status: "Beschikbaar",
                }),
            });
            if (response.ok) {
                setError('Car created successfully.');
                navigate('/managecars');
            } else if (response.status === 409) {
                setError('Kenteken al aanwezig in database.');
            } else {
                const data = await response.json();
                setError(data.message || 'Error creating car.');
            }
        } catch (error) {
            console.error(error);
            setError('caught error creating car');
        }
    };

    /**
     * Handles closing the form and navigating back to the home page.
     */
    const handleClose = () => {
        navigate('/managecars');
    };

    return (
        <div className="container-fluid w-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h1 className="text-center michroma-regular">Create Car</h1>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
            </div>
            <form className="d-flex flex-column justify-content-center align-items-center tomorrow-regular" onSubmit={handleSubmit}>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carSoort" className="form-label m-3">Soort</label>
                    <select
                        id="carSoort"
                        className="form-select bg-dark text-light rounded"
                        value={soort}
                        onChange={(e) => setSoort(e.target.value)}
                    >
                        <option value="">Select Soort</option>
                        <option value="Auto">Auto</option>
                        <option value="Camper">Camper</option>
                        <option value="Caravan">Caravan</option>
                    </select>
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carMerk" className="form-label m-3">Merk</label>
                    <input
                        type="text"
                        id="carMerk"
                        className="form-control bg-dark text-light rounded"
                        value={merk}
                        onChange={(e) => setMerk(e.target.value)}
                    />
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carType" className="form-label m-3">Type</label>
                    <input
                        type="text"
                        id="carType"
                        className="form-control bg-dark text-light rounded"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    />
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carKleur" className="form-label m-3">Kleur</label>
                    <input
                        type="text"
                        id="carKleur"
                        className="form-control bg-dark text-light rounded"
                        value={kleur}
                        onChange={(e) => setKleur(e.target.value)}
                    />
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <div className="input-group rounded">
                        <label htmlFor="carKenteken" className="form-label m-3">Kenteken</label>
                        <input
                            type="text"
                            className="form-control bg-dark text-light rounded-start"
                            aria-label="Kentekenveld1"
                            maxLength="3"
                            value={kenteken1}
                            onChange={(e) => setKenteken1(e.target.value)}
                        />
                        <span className="input-group-text bg-dark text-light fs-2">-</span>
                        <input
                            type="text"
                            className="form-control bg-dark text-light"
                            aria-label="Kentekenveld2"
                            maxLength="3"
                            value={kenteken2}
                            onChange={(e) => setKenteken2(e.target.value)}
                        />
                        <span className="input-group-text bg-dark text-light fs-2">-</span>
                        <input
                            type="text"
                            className="form-control bg-dark text-light rounded-end"
                            aria-label="Kentekenveld3"
                            maxLength="3"
                            value={kenteken3}
                            onChange={(e) => setKenteken3(e.target.value)}
                        />
                    </div>
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carAanschafjaar" className="form-label m-3">Aanschafjaar</label>
                    <input
                        type="number"
                        id="carAanschafjaar"
                        className="form-control bg-dark text-light rounded"
                        min="1900"
                        max="2025"
                        value={aanschafjaar}
                        onChange={(e) => setAanschafjaar(e.target.value)}
                    />
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carPrijsPerDag" className="form-label m-3">Prijs per dag</label>
                    <input
                        type="number"
                        id="carPrijsPerDag"
                        className="form-control bg-dark text-light rounded"
                        min="1"
                        value={prijsPerDag}
                        onChange={(e) => setPrijsPerDag(e.target.value)}
                    />
                </div>
                <div className="m-1 d-flex align-items-center w-100">
                    <label htmlFor="carOpmerking" className="form-label m-3">Opmerking</label>
                    <textarea
                        id="carOpmerking"
                        className="form-control bg-dark text-light rounded"
                        rows="3"
                        value={opmerking}
                        onChange={(e) => setOpmerking(e.target.value)}
                    />
                </div>
                <div className="m-3">
                    <Button variant="primary" type="submit" disabled={!isFormValid}>Create Car</Button>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
            </form>
        </div>
    );
};

export default CreateCar;