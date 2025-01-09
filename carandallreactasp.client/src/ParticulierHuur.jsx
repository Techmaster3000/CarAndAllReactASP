import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import RentModal from './RentModal';

const ParticulierHuur = () => {
    const [cars, setCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [soort, setSoort] = useState('');
    const [sortOption, setSortOption] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await fetch('/api/Vehicles/Beschikbaar', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                //add all the cars to the cars state
                setCars(data);
                //filter the cars based on the selected soort, start date, end date and sort option
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
        filterCars(selectedSoort, startDate, endDate, sortOption);
    };

    const handleDateChange = (e) => {
        const { id, value } = e.target;
        if (id === 'startDate') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }
        filterCars(soort, id === 'startDate' ? value : startDate, id === 'endDate' ? value : endDate, sortOption);
    };

    const handleSortChange = (e) => {
        const selectedSortOption = e.target.value;
        setSortOption(selectedSortOption);
        filterCars(soort, startDate, endDate, selectedSortOption);
    };

    const filterCars = async (selectedSoort, start, end, sortOption) => {
        let filtered = cars;
        if (selectedSoort) {
            filtered = filtered.filter(car => car.soort === selectedSoort);
        }

        //only start filtering if both start and end date are selected
        if (start && end) {
            try {
                //fetch all the cars that are available between the selected start and end date
                const response = await fetch(`/api/Vehicles/GetAvailable?startDatum=${start}&eindDatum=${end}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const unrented = await response.json();
                    console.log('Unrented cars:', unrented);
                    const unrentedCarIds = unrented.map(unrented => unrented.id);
                    console.log('unrented ids: ', unrentedCarIds);
                    filtered = filtered.filter(car => unrentedCarIds.includes(car.id));
                    console.log('after filter:', filtered);
                } else {
                    setError('Error fetching rental information.');
                }
            } catch (error) {
                console.error(error);
                setError('Error fetching rental information.');
            }
        }
        if (sortOption) {
            filtered = sortCars(filtered, sortOption);
        }
        setFilteredCars(filtered);
    };

    const sortCars = (cars, sortOption) => {
        switch (sortOption) {
            case 'prijs-asc':
                return cars.sort((a, b) => a.prijsPerDag - b.prijsPerDag);
            case 'prijs-desc':
                return cars.sort((a, b) => b.prijsPerDag - a.prijsPerDag);
            case 'merk-asc':
                return cars.sort((a, b) => a.merk.localeCompare(b.merk));
            case 'merk-desc':
                return cars.sort((a, b) => b.merk.localeCompare(a.merk));
            default:
                return cars;
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

            <div className="row mb-3">
                <div className="col-md-6 text-light">
                    <label htmlFor="startDate" className="form-label">Start Datum</label>
                    <input
                        type="date"
                        id="startDate"
                        className="form-control"
                        value={startDate}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="col-md-6 text-light">
                    <label htmlFor="endDate" className="form-label">Eind Datum</label>
                    <input
                        type="date"
                        id="endDate"
                        className="form-control"
                        value={endDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
            <div className="row mb-3">
                <div className="col-md-6 text-light">
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
                <div className="col-md-6 text-light">
                    <label htmlFor="sortOption" className="form-label">Sorteer op</label>
                    <select
                        id="sortOption"
                        className="form-select"
                        value={sortOption}
                        onChange={handleSortChange}
                    >
                        <option value="">Sorteeropties</option>
                        <option value="prijs-asc">Prijs (Laag naar Hoog)</option>
                        <option value="prijs-desc">Prijs (Hoog naar Laag)</option>
                        <option value="merk-asc">Merk (A-Z)</option>
                        <option value="merk-desc">Merk (Z-A)</option>
                    </select>
                </div>
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
                <RentModal car={selectedCar} onHide={closeModal} startDate={startDate} endDate={endDate} />
            )}
        </div>
    );
};

export default ParticulierHuur;