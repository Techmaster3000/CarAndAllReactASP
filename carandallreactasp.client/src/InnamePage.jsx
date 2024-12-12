import React, { useEffect, useState } from "react";
import { fetchVehiclesForInname, registerInname } from "./api";
import "./InnamePage.css"; 

const InnamePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [error, setError] = useState("");
    const [messages, setMessages] = useState({});
    const [fotoUrls, setFotoUrls] = useState({});

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await fetchVehiclesForInname();
                setVehicles(data);
            } catch (err) {
                setError(err.message);
            }
        };

        loadVehicles();
    }, []);

    const handleInname = async (vehicleId, status, damage) => {
        try {
            const innameData = {
                Status: status,
                HasDamage: damage,
                Opmerkingen: damage ? "Schade aanwezig bij inname" : "",
                FotoUrl: fotoUrls[vehicleId] || ""
            };
            console.log("Registering Inname for Vehicle ID:", vehicleId);
            console.log("Data to be sent:", innameData);
            
            await registerInname(vehicleId, innameData);
            setMessages((prev) => ({
                ...prev,
                [vehicleId]: "Inname succesvol geregistreerd.",
            }));
            setVehicles((prev) => prev.filter((v) => v.id !== vehicleId)); // Verwijder het voertuig uit de lijst
        } catch (err) {
            setMessages((prev) => ({
                ...prev,
                [vehicleId]: "Fout bij het registreren van de inname.",
            }));
            console.error("Error during inname registration:", err);
        }
    };

    const handleFotoUrlChange = (vehicleId, url) => {
        setFotoUrls((prev) => ({
            ...prev,
            [vehicleId]: url
        }));
    };

    return (
        <div className="container">
            <h3>Voertuigen voor inname</h3>
            {error && <p className="error-message">{error}</p>}
            <ul className="vehicle-list">
                {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                        <strong>{vehicle.merk} {vehicle.type}</strong> ({vehicle.kenteken})
                        <br />
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) =>
                                    handleInname(
                                        vehicle.id,
                                        e.target.checked ? "Met schade" : "Teruggebracht",
                                        e.target.checked
                                    )
                                }
                            />
                            Schade aanwezig
                        </label>
                        <br />
                        <label>
                            Foto URL:
                            <input
                                type="text"
                                value={fotoUrls[vehicle.id] || ""}
                                onChange={(e) =>
                                    handleFotoUrlChange(vehicle.id, e.target.value)
                                }
                            />
                        </label>
                        <br />
                        <button
                            onClick={() =>
                                handleInname(vehicle.id, "Teruggebracht", false)
                            }
                        >
                            Registreer als teruggebracht
                        </button>
                        {messages[vehicle.id] && (
                            <p
                                className={
                                    messages[vehicle.id].startsWith("Fout")
                                        ? "error-message"
                                        : "success-message"
                                }
                            >
                                {messages[vehicle.id]}
                            </p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InnamePage;
