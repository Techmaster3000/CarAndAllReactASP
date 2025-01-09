import { useEffect, useState } from "react";
import {
    fetchAllSchades,
    koppelReparatieAanSchade,
    updateSchadeStatus,
    addSchadeClaim,
} from "./api";
import "./SchadeclaimsPage.css";

/**
 * SchadeclaimsPage component handles the management of schadeclaims.
 * It allows users to view, filter, add, and update schadeclaims.
 */
const SchadeclaimsPage = () => {
    const [schades, setSchades] = useState([]);
    const [statusMessage, setStatusMessage] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("Nieuwe claims");
    const [reparatieDetails, setReparatieDetails] = useState({});
    const [newClaim, setNewClaim] = useState({
        Kenteken: "",
        Beschrijving: "",
        FotoUrl: "",
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    /**
     * Loads all schadeclaims from the server.
     */
    const loadSchades = async () => {
        try {
            const data = await fetchAllSchades();
            setSchades(data);
            if (data.length === 0) {
                setStatusMessage("Geen schadeclaims beschikbaar.");
            }
        } catch (err) {
            setStatusMessage("Fout bij het ophalen van schadeclaims.");
        }
    };

    useEffect(() => {
        loadSchades();
    }, []);

    /**
     * Handles adding a new schadeclaim.
     */
    const handleAddClaim = async () => {
        if (!newClaim.Kenteken || !newClaim.Beschrijving) {
            setStatusMessage("Kenteken en beschrijving zijn verplicht.");
            return;
        }

        try {
            const response = await addSchadeClaim(newClaim);
            setStatusMessage(response.message || "Schadeclaim succesvol toegevoegd en Voertuigstatus op in reparatie gezet");
            setNewClaim({ Kenteken: "", Beschrijving: "", FotoUrl: "" });
            setIsFormOpen(false);
            loadSchades();
        } catch (err) {
            setStatusMessage("Fout bij het toevoegen van de schadeclaim.");
        }
    };

    /**
     * Handles linking a reparatie to a specific schade.
     * @param {number} schadeId - The ID of the schade to link the reparatie to.
     */
    const handleKoppelReparatie = async (schadeId) => {
        if (!reparatieDetails[schadeId]) {
            setStatusMessage("Reparatie details mogen niet leeg zijn.");
            return;
        }

        try {
            const response = await koppelReparatieAanSchade(schadeId, reparatieDetails[schadeId]);
            setStatusMessage(response.message || "Reparatie succesvol gekoppeld.");
            setReparatieDetails((prev) => ({ ...prev, [schadeId]: "" }));
        } catch (err) {
            setStatusMessage("Fout bij het koppelen van de reparatie.");
        }
    };

    /**
     * Handles updating the status of a specific schade.
     * @param {number} schadeId - The ID of the schade to update.
     * @param {string} newStatus - The new status to set.
     */
    const handleStatusUpdate = async (schadeId, newStatus) => {
        try {
            const response = await updateSchadeStatus(schadeId, newStatus);
            setStatusMessage(response.message || "Status succesvol bijgewerkt.");
            loadSchades();
        } catch (err) {
            setStatusMessage("Fout bij het bijwerken van de status.");
        }
    };

    const filteredSchades = schades.filter((schade) => {
        if (selectedStatus === "Nieuwe claims") return schade.status === "Nieuw";
        if (selectedStatus === "In behandeling") return schade.status === "In behandeling";
        if (selectedStatus === "Afgehandelde claims") return schade.status === "Afgehandeld";
        return false;
    });

    return (
        <div className="container">
            <h3>Schadeclaims Beheren</h3>
            {statusMessage && <p className="s-message">{statusMessage}</p>}

            <button
                className="toggle-form-btn"
                onClick={() => setIsFormOpen(!isFormOpen)}
            >
                {isFormOpen ? "- Sluit nieuwe claim formulier" : "+ Open nieuwe claim formulier"}
            </button>

            {isFormOpen && (
                <div className="new-claim-form">
                    <h4>Nieuwe schadeclaim toevoegen</h4>
                    <label>Kenteken:</label>
                    <input
                        type="text"
                        value={newClaim.Kenteken}
                        onChange={(e) => setNewClaim({ ...newClaim, Kenteken: e.target.value })}
                    />
                    <label>Beschrijving:</label>
                    <textarea
                        value={newClaim.Beschrijving}
                        onChange={(e) => setNewClaim({ ...newClaim, Beschrijving: e.target.value })}
                    />
                    <label>Foto URL (optioneel):</label>
                    <input
                        type="text"
                        value={newClaim.FotoUrl}
                        onChange={(e) => setNewClaim({ ...newClaim, FotoUrl: e.target.value })}
                    />
                    <button onClick={handleAddClaim}>Voeg claim toe</button>
                </div>
            )}

            <div className="filter-container">
                <label htmlFor="filter">Filter op claims:</label>
                <select
                    id="filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                >
                    <option value="Nieuwe claims">Nieuwe claims</option>
                    <option value="In behandeling">In behandeling</option>
                    <option value="Afgehandelde claims">Afgehandelde claims</option>
                </select>
            </div>

            <ul className="schade-list">
                {filteredSchades.length > 0 ? (
                    filteredSchades.map((schade) => (
                        <li key={schade.id}>
                            <p>
                                <strong>Voertuig:</strong> {schade.vehicle.merk} {schade.vehicle.type} (
                                {schade.vehicle.kenteken})
                            </p>
                            <p><strong>Status:</strong> {schade.status}</p>
                            <p><strong>Beschrijving:</strong> {schade.opmerkingen}</p>
                            <p><strong>Datum:</strong> {new Date(schade.datum).toLocaleDateString()}</p>
                            {schade.fotoUrl && (
                                <img
                                    src={schade.fotoUrl}
                                    alt="Foto van de schade"
                                    className="schade-photo"
                                />
                            )}
                            {selectedStatus === "Nieuwe claims" && (
                                <>
                                    <textarea
                                        placeholder="Voeg reparatie details toe"
                                        value={reparatieDetails[schade.id] || ""}
                                        onChange={(e) =>
                                            setReparatieDetails((prev) => ({
                                                ...prev,
                                                [schade.id]: e.target.value,
                                            }))
                                        }
                                    ></textarea>
                                    <button onClick={() => handleKoppelReparatie(schade.id)}>
                                        Koppel reparatie
                                    </button>
                                    <button onClick={() => handleStatusUpdate(schade.id, "In behandeling")}>
                                        Zet op In behandeling
                                    </button>
                                </>
                            )}
                            {selectedStatus === "In behandeling" && (
                                <button onClick={() => handleStatusUpdate(schade.id, "Afgehandeld")}>
                                    Zet op Afgehandeld
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <p className="no-schades-message">Geen schadeclaims beschikbaar voor de geselecteerde filter.</p>
                )}
            </ul>
        </div>
    );
};

export default SchadeclaimsPage;