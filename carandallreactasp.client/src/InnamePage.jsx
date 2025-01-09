import { useEffect, useState } from "react";
import { fetchVehiclesForInname, registerInname } from "./api";
import "./InnamePage.css";

/**
 * InnamePage component handles the registration of vehicle returns.
 * It allows users to mark vehicles as returned, with or without damage.
 */
const InnamePage = () => {
    const [vehicles, setVehicles] = useState([]);
    const [formData, setFormData] = useState({});
    const [showMessage, setshowMessage] = useState("");

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const data = await fetchVehiclesForInname();
                setVehicles(data);
            } catch (err) {
                setshowMessage(err.message);
                setTimeout(() => setshowMessage(""), 5000); 
            }
        };
        loadVehicles();
    }, []);

    /**
     * Handles input changes for the form data.
     * @param {number} vehicleId - The ID of the vehicle.
     * @param {string} field - The field name to update.
     * @param {any} value - The new value for the field.
     */
    const handleInputChange = (vehicleId, field, value) => {
        setFormData((prev) => ({
            ...prev,
            [vehicleId]: {
                ...prev[vehicleId],
                [field]: value,
            },
        }));
    };

    /**
     * Handles the registration of a vehicle return.
     * @param {number} vehicleId - The ID of the vehicle to register.
     */
    const handleInname = async (vehicleId) => {
        const data = formData[vehicleId] || {};
        const isDamage = data.hasDamage || false;
        const innameData = {
            Status: isDamage ? "Met schade" : "Beschikbaar",
            HasDamage: isDamage,
            Opmerkingen: data.opmerkingen || "",
            FotoUrl: data.fotoUrl || "",
        };

        try {
            await registerInname(vehicleId, innameData);
            const successMessage = !isDamage
                ? `Voertuig (${vehicleId}) is succesvol teruggebracht en direct beschikbaar gesteld voor verhuur.`
                : `Voertuig (${vehicleId}) is geregistreerd met schade. Controleer de schademeldingen.`;

            setshowMessage(successMessage);
            setVehicles((prev) => prev.filter((v) => v.id !== vehicleId)); // Verwijder voertuig uit lijst

            // Verberg melding na 5 seconden
            setTimeout(() => setshowMessage(""), 5000);
        } catch (err) {
            console.error("Fout tijdens registratie:", err);
            setshowMessage("Fout bij het registreren van de inname.");
            setTimeout(() => setshowMessage(""), 5000); 
        }
    };

    return (
        <div className="container">
            <h3>Voertuigen voor inname</h3>

            {showMessage && <p className="s-message">{showMessage}</p>}

            <ul className="vehicle-list">
                {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                        <strong>{vehicle.merk} {vehicle.type}</strong> ({vehicle.kenteken})
                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        handleInputChange(vehicle.id, "hasDamage", e.target.checked)
                                    }
                                />
                                Schade aanwezig
                            </label>

                            {formData[vehicle.id]?.hasDamage && (
                                <>
                                    <label>
                                        Opmerkingen:
                                        <textarea
                                            placeholder="Opmerkingen over schade"
                                            rows="2"
                                            value={formData[vehicle.id]?.opmerkingen || ""}
                                            onChange={(e) =>
                                                handleInputChange(vehicle.id, "opmerkingen", e.target.value)
                                            }
                                        />
                                    </label>
                                    <label>
                                        Foto URL:
                                        <input
                                            type="text"
                                            placeholder="URL van schadefoto"
                                            value={formData[vehicle.id]?.fotoUrl || ""}
                                            onChange={(e) =>
                                                handleInputChange(vehicle.id, "fotoUrl", e.target.value)
                                            }
                                        />
                                    </label>
                                </>
                            )}
                        </div>
                        <button onClick={() => handleInname(vehicle.id)}>
                            Registreer inname
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InnamePage;
