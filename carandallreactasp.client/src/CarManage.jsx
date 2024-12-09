import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './custom.css';

const CarManage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState('');

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
        // Implement edit functionality here
        console.log('Edit vehicle:', vehicle);
    };

    const handleDelete = async (vehicleId) => {
        if (window.)
    
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
    };

    return (
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
                                <td>
                                    <Button variant="warning" className="me-2" onClick={() => handleEdit(vehicle)}>Edit</Button>
                                    <Button variant="danger" onClick={() => handleDelete(vehicle.id)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CarManage;