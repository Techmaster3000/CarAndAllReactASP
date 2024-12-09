import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RentModal from './RentModal';

const ParticulierHuur = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [soort, setSoort] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/Vehicles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCars(data);
                setFilteredCars(data);
            } else {
                setError('Error fetching cars.');
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching cars.');
        }
    };

    const handleFilterChange = (e) => {
        const selectedSoort = e.target.value;
        setSoort(selectedSoort);
        if (selectedSoort === '') {
            setFilteredCars(cars);
        } else {
            setFilteredCars(cars.filter(car => car.soort === selectedSoort));
        }
    };

    const handleRent = async (startDate, endDate) => {
        try {
            const response = await fetch(`/api/Rentals`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId: selectedCar.id, startDate, endDate }),
            });

            if (response.ok) {
                setMessage('Vehicle rented successfully.');
            } else {
                setError('Error renting vehicle.');
            }
        } catch (error) {
            console.error(error);
            setError('Error renting vehicle.');
        }
    };

    const openModal = (car) => {
        setSelectedCar(car);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCar(null);
    };

    return (
        <div className="container mt-5">
            <h1>Particulier Huur</h1>
            <div className="mb-3">
                <label htmlFor="filterSoort" className="form-label">Filter op Soort</label>
                <select
                    id="filterSoort"
                    className="form-select"
                    value={soort}
                    onChange={handleFilterChange}
                >
                    <option value="">Alle Soorten</option>
                    <option value="Auto">Auto</option>
                    <option value="Camper">Camper</option>
                    <option value="Caravan">Caravan</option>
                </select>
            </div>
            {error && <div className="text-danger">{error}</div>}
            {message && <div className="text-success">{message}</div>}
            <div className="table-responsive rounded-2">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Soort</th>
                            <th>Merk</th>
                            <th>Type</th>
                            <th>Kleur</th>
                            <th>Kenteken</th>
                            <th>Aanschafjaar</th>
                            <th>Prijs Per Dag</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCars.map((car) => (
                            <tr key={car.id}>
                                <td>{car.soort}</td>
                                <td>{car.merk}</td>
                                <td>{car.type}</td>
                                <td>{car.kleur}</td>
                                <td>{car.kenteken}</td>
                                <td>{car.aanschafjaar}</td>
                                <td>{car.prijsPerDag}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => openModal(car)}
                                    >
                                        Huur
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selectedCar && (
                <RentModal car={selectedCar} onHide={closeModal} onRent={handleRent} />
            )}
        </div>
    );
};

export default ParticulierHuur;