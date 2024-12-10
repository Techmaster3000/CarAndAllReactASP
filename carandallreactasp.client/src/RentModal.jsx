import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import getCookie from './helpers/getCookie';


const RentModal = ({ car, onHide }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        if (startDate && endDate) {
            const timeDiff = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
            setTotalPrice(diffDays * car.prijsPerDag);
        } else {
            setTotalPrice(0);
        }
    }, [startDate, endDate, car.prijsPerDag]);

    const handleRent = async (e) => {
        e.preventDefault();
        const today = new Date();
        if (!startDate || !endDate) {
            setError('Please select both start and end dates.');
        } else if (startDate < today) {
            setError('Start date cannot be before today.');
        } else if (endDate < startDate) {
            setError('End date cannot be before start date.');
        } else {
            try {
                const payload = {
                    voertuigID: car.id,
                    userID: getCookie('userId'),
                    VoertuigNaam: car.merk + " " + car.type,
                    startDatum: startDate,
                    eindDatum: endDate,
                    totaalPrijs: totalPrice
                };

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
        <div className="modal fade show d-flex align-items-center">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Huur Auto</h5>
                        <button type="button" className="close" onClick={onHide}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className="d-flex flex-column justify-content-center align-items-center" onSubmit={handleRent}>
                            <div className="m-1 d-flex align-items-center w-100">
                                <label htmlFor="Startdatum" className="form-label m-3">Startdatum</label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    className="form-control bg-dark text-light rounded"
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Select a start date"
                                    minDate={new Date()}
                                />
                            </div>
                            <div className="m-1 d-flex align-items-center w-100">
                                <label htmlFor="Einddatum" className="form-label m-3">Einddatum</label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    className="form-control bg-dark text-light rounded"
                                    dateFormat="dd-MM-yyyy"
                                    placeholderText="Select an end date"
                                    minDate={startDate || new Date()}
                                />
                            </div>
                            <div className="mt-3">
                                <h5>Total Price: &euro;{totalPrice}</h5>
                            </div>
                            <div className="modal-footer">
                                <Button variant="secondary" onClick={onHide}>Close</Button>
                            </div>
                            <div className="m-3">
                                <Button variant="primary" type="submit">Verstuur Huuraanvraag</Button>
                            </div>
                            {error && <div className="text-danger mt-2">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RentModal;