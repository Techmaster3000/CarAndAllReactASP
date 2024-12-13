import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import imgData from './assets/imagedataCarAndAll';

const RentalDetailsModal = ({ show, onHide, rental, car }) => {
    if (!rental) return null;
    const [user, setUser] = useState(null);

    const fetchUserDetails = async (callback) => {
        try {
            const response = await fetch(`/api/Users/${rental.userID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                if (callback) callback(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const generatePDF = (user) => {
        const doc = new jsPDF();

        doc.addImage(imgData, 'PNG', 10, 10, 50, 50);

        // Add title
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text('Verhuur Factuur', 70, 30);

        // Add user information
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Klantnaam: ${user.naam}`, 100, 70);
        doc.text(`Emailadres: ${user.email}`, 100, 80);
        doc.text(`Telefoonnummer: ${user.phoneNumber}`, 100, 90);

        // Add rental details
        doc.text(`Voertuig Naam: ${rental.voertuigNaam}`, 20, 70);
        if (car) {
            doc.text(`Soort Voertuig: ${car.soort}`, 20, 80);
            doc.text(`Prijs Per Dag: ${car.prijsPerDag} euro`, 20, 90);
        }
        doc.text(`Start Datum: ${new Date(rental.startDatum).toLocaleDateString()}`, 20, 100);
        doc.text(`Eind Datum: ${new Date(rental.eindDatum).toLocaleDateString()}`, 20, 110);
        doc.text(`Totaalprijs: ${rental.totaalPrijs} euro`, 20, 120);

        doc.autoTable({
            startY: 130,
            head: [['Omschrijving', 'Details']],
            body: [
                ['Voertuignaam', rental.voertuigNaam],
                ['Soort Voertuig', car ? car.soort : 'Loading...'],
                ['Prijs Per Dag', car ? `${car.prijsPerDag} euro` : 'Loading...'],
                ['Start Datum', new Date(rental.startDatum).toLocaleDateString()],
                ['Eind Datum', new Date(rental.eindDatum).toLocaleDateString()],
                ['Totaalprijs', `${rental.totaalPrijs} euro`],
            ],
        });

        doc.setFontSize(10);
        doc.text('Bedankt voor uw vertrouwen in ons!', 20, doc.internal.pageSize.height - 30);
        doc.text('Contact: info@carandall.com | Telefoon: 123-456-7890', 20, doc.internal.pageSize.height - 20);

        doc.save('invoice.pdf');
    };

    const handleDownloadInvoice = async () => {
        await fetchUserDetails(generatePDF);
    };

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
                <Button variant="warning" onClick={handleDownloadInvoice}>Download Invoice</Button>
                <Button variant="secondary" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RentalDetailsModal;