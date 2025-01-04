import { useEffect, useState } from "react";
import { fetchAllVehicles, blokkeerVoertuig, deblokkeerVoertuig } from "./api";
import "./VehicleBeheerPage.css";

const VehicleBeheerPage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [blockReason, setBlockReason] = useState({});
    const [filter, setFilter] = useState("Alle");

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await fetchAllVehicles();
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

    const handleBlockVehicle = async (vehicleId) => {
        if (!blockReason[vehicleId]) {
            setStatusMessage("Reden voor blokkeren is verplicht.");
            return;
        }

        try {
            const response = await blokkeerVoertuig(vehicleId, blockReason[vehicleId]);
            setStatusMessage(response.message || "Voertuig succesvol geblokkeerd.");
            setVehicles((prev) =>
                prev.map((vehicle) =>
                    vehicle.id === vehicleId ? { ...vehicle, status: "Geblokkeerd" } : vehicle
                )
            );
        } catch (err) {
            setStatusMessage("Fout bij het blokkeren van het voertuig.");
        }
    };

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
                            {vehicle.status === "Geblokkeerd" && (
                                <button onClick={() => handleUnblockVehicle(vehicle.id)}>
                                    Deblokkeer Voertuig
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="no-vehicles-message">
                        Geen voertuigen beschikbaar voor de geselecteerde filter.
                    </p>
                )}
            </ul>
        </div>
    );
};

export default VehicleBeheerPage;
