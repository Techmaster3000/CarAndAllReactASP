import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import EditCar from './EditCar';

const CarManage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            const response = await fetch('/api/Vehicles', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setVehicles(data);
            } else {
                setError('Error fetching vehicles.');
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching vehicles.');
        }
    };

    const handleEdit = (vehicle) => {
        setSelectedCar(vehicle);
        setShowModal(true);
    };

    const handleDelete = async (vehicleId) => {
        if (window.confirm("Are you sure you want to delete this car? This cannot be undone.")) {
            try {
                const response = await fetch(`/api/Vehicles/${vehicleId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setVehicles(vehicles.filter(vehicle => vehicle.id !== vehicleId));
                } else {
                    setError('Error deleting vehicle.');
                }
            } catch (error) {
                console.error(error);
                setError('Error deleting vehicle.');
            }
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCar(null);
    };

    const handleSaveChanges = () => {
        fetchVehicles();
        handleCloseModal();
    };

    return (
        <div>
        <div className="container-fluid w-100 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
            <div className="text-center">
                <h1>Manage Cars</h1>
            </div>
            <div className="text-center mb-3">
                <Button variant="primary" href="/createcar">Add Car</Button>
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Soort</th>
                            <th>Merk</th>
                            <th>Type</th>
                            <th>Kleur</th>
                            <th>Kenteken</th>
                            <th>Aanschafjaar</th>
                            <th>Prijs Per Dag</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.id}</td>
                                <td>{vehicle.soort}</td>
                                <td>{vehicle.merk}</td>
                                <td>{vehicle.type}</td>
                                <td>{vehicle.kleur}</td>
                                <td>{vehicle.kenteken}</td>
                                <td>{vehicle.aanschafjaar}</td>
                                <td>{vehicle.prijsPerDag}</td>
                                <td>
                                    <Button variant="secondary" className="me-2" onClick={() => handleEdit(vehicle)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(vehicle.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            
            </div>
            {showModal && selectedCar && (
                <EditCar car={selectedCar} onClose={handleCloseModal} onSave={handleSaveChanges} />
            )}
        </div>
    );
};

export default CarManage;