import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const RentalDetailsModal = ({ show, onHide, rental, car }) => {
    if (!rental) return null;

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Verhuur Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Voertuig Naam:</strong> {rental.voertuigNaam}</p>
                {car ? (
                    <>
                        <p><strong>Soort Voertuig:</strong> {car.soort}</p>
                        <p><strong>Prijs Per Dag:</strong> &euro;{car.prijsPerDag}</p>
                    </>
                ) : (
                    <p>Loading car details...</p>
                )}
                <p><strong>Start Datum:</strong> {new Date(rental.startDatum).toLocaleDateString()}</p>
                <p><strong>Eind Datum:</strong> {new Date(rental.eindDatum).toLocaleDateString()}</p>
                <p><strong>Totaalprijs:</strong> &euro;{rental.totaalPrijs}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RentalDetailsModal;