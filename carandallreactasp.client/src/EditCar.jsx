import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

/**
 * EditCar component handles the editing of car details.
 * It includes form fields for car details and performs validation
 * before submitting the updated data to the server.
 * @param {Object} props - The component props.
 * @param {Object} props.car - The car details to edit.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSave - Function to save the changes.
 * @returns {JSX.Element} The rendered component.
 */
const EditCar = ({ car, onClose, onSave }) => {
    const [soort, setSoort] = useState(car.soort);
    const [merk, setMerk] = useState(car.merk);
    const [type, setType] = useState(car.type);
    const [kleur, setKleur] = useState(car.kleur);
    const [prijsPerDag, setPrijsPerDag] = useState(car.prijsPerDag);
    const [kenteken, setKenteken] = useState(car.kenteken);
    const [aanschafjaar, setAanschafjaar] = useState(car.aanschafjaar);
    const [opmerkingen, setOpmerkingen] = useState(car.opmerkingen);
    const [status, setStatus] = useState(car.status); // New state for status
    const [error, setError] = useState('');

    /**
     * Handles the form submission to update the car details.
     * @param {Event} e - The form submission event.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`/api/Vehicles/${car.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: car.id,
                    soort: soort,
                    merk: merk,
                    type: type,
                    kleur: kleur,
                    kenteken: kenteken,
                    aanschafjaar: aanschafjaar,
                    opmerkingen: opmerkingen,
                    prijsPerDag: prijsPerDag,
                    status: status // Include status in the request body
                }),
            });
            if (response.ok) {
                onSave();
            } else {
                const data = await response.json();
                setError(data.message || 'Error updating car.');
            }
        } catch (error) {
            console.error(error);
            setError('Error updating car.');
        }
    };

    return (
        <div className="modal fade show d-flex align-items-center" style={{ display: 'block' }} tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Car</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={handleSubmit}>
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
                                <label htmlFor="carKenteken" className="form-label m-3">Kenteken</label>
                                <input
                                    type="text"
                                    id="carKenteken"
                                    className="form-control bg-dark text-light rounded"
                                    value={kenteken}
                                    onChange={(e) => setKenteken(e.target.value)}
                                />
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
                                <label htmlFor="carPrijsPerDag" className="form-label m-3">Prijs Per Dag</label>
                                <input
                                    type="number"
                                    id="carPrijsPerDag"
                                    className="form-control bg-dark text-light rounded"
                                    min="0"
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
                                    value={opmerkingen}
                                    onChange={(e) => setOpmerkingen(e.target.value)}
                                />
                            </div>
                            <div className="m-1 d-flex align-items-center w-100">
                                <label htmlFor="carStatus" className="form-label m-3">Status</label>
                                <select
                                    id="carStatus"
                                    className="form-select bg-dark text-light rounded"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="Beschikbaar">Beschikbaar</option>
                                    <option value="Met schade">Met schade</option>
                                    <option value="Verhuurd">Verhuurd</option>
                                </select>
                            </div>
                            <div className="m-3">
                                <Button variant="primary" type="submit">Save Changes</Button>
                            </div>
                            {error && <div className="text-danger mt-2">{error}</div>}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <Button variant="secondary" onClick={onClose}>Close</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCar;