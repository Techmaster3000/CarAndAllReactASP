import NavBar from './NavBar';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import getCookie from './helpers/getCookie';
import { PiListBold } from "react-icons/pi";
import RentalDetailsModal from './HuurDetailsModal';

const ParticulierPage = () => {
    const [currentVerhuur, setCurrentVerhuur] = useState([]);
    const [error, setError] = useState('');
    const [pastVerhuur, setPastVerhuur] = useState([]);
    const [futureVerhuur, setFutureVerhuur] = useState([]);
    const [selectedRental, setSelectedRental] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchVerhuur = async () => {
            try {
                const response = await fetch(`/api/ParticuliereVerhuurs/user/${getCookie('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const today = new Date();
                    const Verhuur = await response.json();
                    const current = Verhuur.filter(rental => new Date(rental.startDatum) <= today && new Date(rental.eindDatum) >= today);
                    const past = Verhuur.filter(rental => new Date(rental.eindDatum) < today);
                    const future = Verhuur.filter(rental => new Date(rental.startDatum) > today);
                    setCurrentVerhuur(current);
                    setPastVerhuur(past);
                    setFutureVerhuur(future);
                } else {
                    setError('Error fetching Verhuur.');
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching Verhuur.');
            }
        };
        fetchVerhuur();
    }, []);

    const handleShowModal = (rental) => {
        setSelectedRental(rental);
        fetchCarDetails(rental);
        setShowModal(true);
    };

    const handleHideModal = () => {
        setSelectedRental(null);
        setSelectedCar(null); // Reset selectedCar state
        setShowModal(false);
    };

    const fetchCarDetails = async (rental) => {
        try {
            const response = await fetch(`/api/Vehicles/${rental.voertuigID}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setSelectedCar(data);
            } else {
                setError('Error fetching car details.');
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching car details.');
        }
    };

    return (
        <div>
            <NavBar />
            <div className="container-fluid mt-4 text-light">
                {error && <div className="text-danger">{error}</div>}
                <div className="row">
                    <div className="col-md-4">
                        <h2>Lopende Verhuur</h2>
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Voertuig Naam</th>
                                    <th>Start</th>
                                    <th>Einde</th>
                                    <th>Prijs</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentVerhuur.length > 0 ? (
                                    currentVerhuur.map(rental => (
                                        <tr key={rental.verhuurID}>
                                            <td>{rental.voertuigNaam}</td>
                                            <td>{new Date(rental.startDatum).toLocaleDateString()}</td>
                                            <td>{new Date(rental.eindDatum).toLocaleDateString()}</td>
                                            <td>&euro;{rental.totaalPrijs}</td>
                                            <td><PiListBold onClick={() => handleShowModal(rental)} style={{ cursor: 'pointer' }} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Geen gevonden</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <h2>Verlopen Verhuur</h2>
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Voertuig Naam</th>
                                    <th>Start</th>
                                    <th>Einde</th>
                                    <th>Prijs</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastVerhuur.length > 0 ? (
                                    pastVerhuur.map(rental => (
                                        <tr key={rental.verhuurID}>
                                            <td>{rental.voertuigNaam}</td>
                                            <td>{new Date(rental.startDatum).toLocaleDateString()}</td>
                                            <td>{new Date(rental.eindDatum).toLocaleDateString()}</td>
                                            <td>&euro;{rental.totaalPrijs}</td>
                                            <td><PiListBold onClick={() => handleShowModal(rental)} style={{ cursor: 'pointer' }} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Geen gevonden</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-4">
                        <h2>Geplande Verhuur</h2>
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>Voertuig Naam</th>
                                    <th>Start</th>
                                    <th>Einde</th>
                                    <th>Prijs</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {futureVerhuur.length > 0 ? (
                                    futureVerhuur.map(rental => (
                                        <tr key={rental.verhuurID}>
                                            <td>{rental.voertuigNaam}</td>
                                            <td>{new Date(rental.startDatum).toLocaleDateString()}</td>
                                            <td>{new Date(rental.eindDatum).toLocaleDateString()}</td>
                                            <td>&euro;{rental.totaalPrijs}</td>
                                            <td><PiListBold onClick={() => handleShowModal(rental)} style={{ cursor: 'pointer' }} /></td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">Geen gevonden</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <RentalDetailsModal show={showModal} onHide={handleHideModal} rental={selectedRental} car={selectedCar} />
        </div>
    );
};

export default ParticulierPage;