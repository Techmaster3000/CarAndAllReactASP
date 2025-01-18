import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';
import EditCar from './EditCar';
import NavBar from './NavBar'

/**
 * CarManage component handles the management of vehicles.
 * It allows users to view, edit, and delete vehicles.
 */
const CarManage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);

    useEffect(() => {
        fetchVehicles();
    }, []);

    /**
     * Fetches the list of vehicles from the server.
     */
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

    /**
     * Handles the edit action for a vehicle.
     * @param {Object} vehicle - The vehicle to edit.
     */
    const handleEdit = (vehicle) => {
        setSelectedCar(vehicle);
        setShowModal(true);
    };

    /**
     * Handles the delete action for a vehicle.
     * @param {number} vehicleId - The ID of the vehicle to delete.
     */
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

    /**
     * Handles closing the edit modal.
     */
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCar(null);
    };

    /**
     * Handles saving changes after editing a vehicle.
     */
    const handleSaveChanges = () => {
        fetchVehicles();
        handleCloseModal();
    };

    return (
        <div>
        <NavBar />
            <div className="container-fluid w-100 h-50 d-flex flex-column bg-white position-absolute top-50 start-50 translate-middle rounded-2">
                <div className="text-center michroma-regular pt-2 pb-4">
                    <h1>Manage Cars</h1>
                </div>
                <div className="text-center mb-3 tomorrow-regular rounded-1">
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
                                <th>Status</th> {/* Add header for status */}
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
                                    <td>{vehicle.status}</td> {/* Add status column */}
                                    <td className="tomorrow-regular rounded-1">
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