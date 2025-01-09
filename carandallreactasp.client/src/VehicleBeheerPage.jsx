import { useEffect, useState } from "react";
import { fetchAllVehicles, blokkeerVoertuig, deblokkeerVoertuig } from "./api";
import "./VehicleBeheerPage.css";

const VehicleBeheerPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [blockReason, setBlockReason] = useState({});
    const [filter, setFilter] = useState("Alle");

    useEffect(() => {
        //load all vehicles from the database, update when the user changes the filter
        const loadVehicles = async () => {
            try {
                const data = await fetchAllVehicles();
                //put all the returned vehicles in the state
                setVehicles(data);
                if (data.length === 0) {
                    setStatusMessage("Geen voertuigen beschikbaar.");
                }
            } catch (err) {
                setStatusMessage("Fout bij het ophalen van voertuigen.");
            }
        };

        loadVehicles();
    }, [filter]);

    //function to block the vehicle when the block button is clicked
    const handleBlockVehicle = async (vehicleId) => {
        //check if the user has entered a reason for blocking the vehicle
        if (!blockReason[vehicleId]) {
            setStatusMessage("Reden voor blokkeren is verplicht.");
            return;
        }

        try {
            const response = await blokkeerVoertuig(vehicleId, blockReason[vehicleId]);
            setStatusMessage(response.message || "Voertuig succesvol geblokkeerd.");

            //update the status of the vehicle in the state to "Geblokkeerd"
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.id === vehicleId ? { ...vehicle, status: "Geblokkeerd" } : vehicle
                )
            );
        } catch (err) {
            setStatusMessage("Fout bij het blokkeren van het voertuig.");
        }
    };


    //function to unblock the vehicle when the unblock button is clicked
    const handleUnblockVehicle = async (vehicleId) => {
        try {
            const response = await deblokkeerVoertuig(vehicleId);
            setStatusMessage(response.message || "Voertuig succesvol gedeblokkeerd.");
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.id === vehicleId ? { ...vehicle, status: "Beschikbaar" } : vehicle
                )
            );
        } catch (err) {
            setStatusMessage("Fout bij het deblokkeren van het voertuig.");
        }
    };

    const filteredVehicles =
        filter === "Alle"
            ? vehicles
            : vehicles.filter((vehicle) => vehicle.status === "Geblokkeerd");

    return (
        <div className="container">
            <h3>Voertuigen Blokkeren & Deblokkeren</h3>
            {statusMessage && <p className="s-message">{statusMessage}</p>}

            <div className="filter-container">
                <label htmlFor="filter">Filter op status:</label>
                <select
                    id="filter"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="Alle">Alle voertuigen</option>
                    <option value="Geblokkeerd">Geblokkeerde voertuigen</option>
                </select>
            </div>
            {/*the filtered vehicles are displayed in a list*/}
            <ul className="vehicle-list">
                {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                        <li key={vehicle.id}>
                            <p>
                                <strong>{vehicle.merk} {vehicle.type}</strong> ({vehicle.kenteken})
                            </p>
                            <p><strong>Status:</strong> {vehicle.status}</p>
                            {vehicle.status === "Beschikbaar" && (
                                <>
                                    <textarea
                                        placeholder="Reden voor blokkeren"
                                        value={blockReason[vehicle.id] || ""}
                                        onChange={(e) =>
                                            setBlockReason((prev) => ({
                                                ...prev,
                                                [vehicle.id]: e.target.value,
                                            }))
                                        }
                                    ></textarea>
                                    <button onClick={() => handleBlockVehicle(vehicle.id)}>
                                        Blokkeer Voertuig
                                    </button>
                                </>
                            )}
                            {/*Button to unblock the vehicle is displayed when the vehicle is blocked*/}
                            {vehicle.status === "Geblokkeerd" && (
                                <button onClick={() => handleUnblockVehicle(vehicle.id)}>
                                    Deblokkeer Voertuig
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                        //Message is displayed when there are no vehicles found for the selected filter
                    <p className="no-vehicles-message">
                        Geen voertuigen beschikbaar voor de geselecteerde filter.
                    </p>
                )}
            </ul>
        </div>
    );
};

export default VehicleBeheerPage;
