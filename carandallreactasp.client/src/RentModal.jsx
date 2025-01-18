import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import getCookie from './helpers/getCookie';

const RentModal = ({ car, onHide, startDate, endDate }) => {
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        // Calculate total price based on selected dates and car price per day
        if (startDate && endDate) {
            const timeDiff = Math.abs(new Date(endDate) - new Date(startDate));
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            setTotalPrice(diffDays * car.prijsPerDag);
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, car.prijsPerDag]);

    const handleRent = async (e) => {
        e.preventDefault();
        const today = new Date();
        //check if start date and end date are selected and valid
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
        } else if (new Date(startDate) < today) {
            setError('Start date cannot be before today.');
        } else if (new Date(endDate) < new Date(startDate)) {
            setError('End date cannot be before start date.');
        } else {
            try {
                //create a payload object with all rental information
                const payload = {
                    voertuigID: car.id,
                    userID: getCookie('userId'),
                    VoertuigNaam: car.merk + " " + car.type,
                    VoertuigSoort: car.soort,
                    startDatum: startDate,
                    eindDatum: endDate,
                    totaalPrijs: totalPrice
                };
                //send a POST request to create a new rental with the payload
                const response = await fetch('/api/ParticuliereVerhuurs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });

                if (response.status === 201) {
                    console.log('Rental created successfully');
                    onHide();
                } else {
                    const errorData = await response.json();
                    console.error('Error response:', errorData);
                    setError('Failed to create rental. Please try again.');
                }
            } catch (error) {
                setError('Failed to create rental. Please try again.');
                console.error('Caught error:', error);
            }
        }
    };

    return (
        <Modal show onHide={onHide} centered size="sm">
            <Modal.Header closeButton>
                <Modal.Title className="tomorrow-regular">Huur Auto</Modal.Title>
            </Modal.Header>
            <Modal.Body className="chakra-petch-regular">
                <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={handleRent}>
                    <div className="m-1 d-flex align-items-center w-auto">
                        <label htmlFor="Startdatum" className="form-label m-3">Startdatum</label>
                        <div className="form-control bg-dark text-light rounded-1 text-center">
                            {new Date(startDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="m-1 d-flex align-items-center w-auto">
                        <label htmlFor="Einddatum" className="form-label m-3">Einddatum</label>
                        <div className="form-control bg-dark text-light rounded-1 text-center">
                            {new Date(endDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div className="mt-3">
                        <h5>Total Price: &euro;{totalPrice}</h5>
                    </div>
                    <div className="m-3 rounded-1">
                        <Button variant="primary" type="submit">Verstuur Huuraanvraag</Button>
                    </div>
                    {error && <div className="text-danger mt-2">{error}</div>}
                </form>
            </Modal.Body>
        </Modal>
    );
};

export default RentModal;


