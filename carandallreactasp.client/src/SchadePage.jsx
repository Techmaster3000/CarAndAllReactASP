import { useEffect, useState } from "react";
import { fetchSchades, updateVehicleStatus, addSchadeComment } from "./api";
import "./SchadePage.css";

const SchadePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [comment, setComment] = useState({});
    const [loading, setLoading] = useState(true);

    //fetch all schades and filter out the ones with status "Nieuw"
    const loadSchades = async () => {
        setLoading(true);
        try {
            const data = await fetchSchades();
            const filteredData = data.filter(vehicle =>
                vehicle.schades.some(schade => schade.status === "Nieuw")
            );
            setVehicles(filteredData);
            if (filteredData.length === 0) {
                setStatusMessage("Geen nieuwe schademeldingen beschikbaar.");
            }
        } catch (err) {
            setStatusMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //update the schades in realtime
        loadSchades();
    }, []);

    //handle updating the status of the vehicle
    const handleStatusUpdate = async (vehicleId, newStatus) => {
        try {
            const response = await updateVehicleStatus(vehicleId, newStatus);
            setStatusMessage(response.message || "Status succesvol bijgewerkt.");
            loadSchades(); // Refresh 
        } catch (err) {
            console.error("Fout bij het bijwerken van de voertuigstatus:", err);
            setStatusMessage("Fout bij het bijwerken van de voertuigstatus.");
        }
    };

    //handle adding a comment to a schade
    const handleAddComment = async (schadeId) => {
        try {
            const response = await addSchadeComment(schadeId, comment[schadeId] || "");
            setStatusMessage(response.message || "Opmerking succesvol toegevoegd.");
            setComment((prev) => ({ ...prev, [schadeId]: "" })); 
            loadSchades(); // Refresh
        } catch (err) {
            console.error("Fout bij het toevoegen van de opmerking:", err);
            setStatusMessage("Fout bij het toevoegen van de opmerking.");
        }
    };

    return (
        <div className="container">
            <h3>Schademeldingen</h3>
            <h6>uit innames</h6>
            {statusMessage && <p className="s-message">{statusMessage}</p>}

            {loading ? (
                <p>Gegevens laden...</p>
            ) : vehicles.length > 0 ? (
                <ul className="vehicle-list">
                    {vehicles.map((vehicle) => (
                        <li key={vehicle.vehicleId}>
                            <strong>
                                {vehicle.merk} {vehicle.type} ({vehicle.kenteken})
                            </strong>
                            <p>Status: {vehicle.status}</p>
                            <ul className="damage-list">
                                {vehicle.schades && vehicle.schades.length > 0 ? (
                                    vehicle.schades
                                        .filter((schade) => schade.status === "Nieuw")
                                        .map((schade) => (
                                            <li key={schade.id}>
                                                <p>
                                                    <strong>Datum:</strong> {new Date(schade.datum).toLocaleDateString()}
                                                </p>
                                                <p>
                                                    <strong>Opmerkingen:</strong> {schade.opmerkingen || "Geen opmerkingen"}
                                                </p>
                                                {schade.fotoUrl && (
                                                    <img
                                                        src={schade.fotoUrl}
                                                        alt="Schade"
                                                        className="damage-photo"
                                                    />
                                                )}
                                                <textarea
                                                    placeholder="Voeg een opmerking toe"
                                                    value={comment[schade.id] || ""}
                                                    onChange={(e) =>
                                                        setComment((prev) => ({
                                                            ...prev,
                                                            [schade.id]: e.target.value,
                                                        }))
                                                    }
                                                ></textarea>
                                                <button onClick={() => handleAddComment(schade.id)}>
                                                    Voeg opmerking toe
                                                </button>
                                            </li>
                                        ))
                                ) : (
                                    <p>Geen nieuwe schades gevonden.</p>
                                )}
                            </ul>
                            <button
                                onClick={() => handleStatusUpdate(vehicle.vehicleId, "In reparatie")}
                            >
                                Zet status op "In reparatie"
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-schades-message">
                    Geen voertuigen met nieuwe schades beschikbaar.
                </p>
            )}
        </div>
    );
};

export default SchadePage;
