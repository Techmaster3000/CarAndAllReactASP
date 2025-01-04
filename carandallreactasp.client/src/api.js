const api_url = "https://localhost:7048/api";
const Verhuurdto_url = "https://localhost:7048/api/ParticuliereVerhuurs/dto";
const Verhuur_url = "https://localhost:7048/api/ParticuliereVerhuurs";

export const fetchHuurverzoeken = async () => {
    const response = await fetch(Verhuurdto_url);
    if (!response.ok) {
        throw new Error('Fout bij het ophalen van huurverzoeken.');
    }
    return await response.json();
};

export const registreerUitgifte = async (verhuurID, gegevens) => {
    const response = await fetch(`${Verhuur_url}/uitgifte/${verhuurID}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gegevens), 
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fout bij het registreren van de uitgifte.');
    }

    return await response.json(); 
};



export const fetchVehiclesForInname = async () => {
    const response = await fetch(`${api_url}/Vehicles/VoorInname`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Fout bij het ophalen van voertuigen.");
    }
    return await response.json();
};



export const registerInname = async (vehicleId, innameData) => {
    console.log(innameData);
    const response = await fetch(`${api_url}/Vehicles/Inname/${vehicleId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(innameData),
    });

    if (!response.ok) {
        try {
            const error = await response.json();
            console.error("Validation Errors:", error.errors);
            throw new Error(error.message);
        } catch (err) {
            throw new Error("Er is een fout opgetreden bij het registreren van de inname.");
        }
    }
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};

export const fetchSchades = async () => {
    const response = await fetch(`${api_url}/Schades/Schades`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fout bij ophalen van schades");
    }
    return await response.json();
};

export const updateVehicleStatus = async (vehicleId, newStatus) => {
    const response = await fetch(`${api_url}/Schades/VoertuigStatus/${vehicleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
    });
    if (!response.ok) {
        throw new Error("Fout bij status update");
    }
    return await response.json();
};

export const addSchadeComment = async (schadeId, comment) => {
    const response = await fetch(`${api_url}/Schades/Schade/${schadeId}/Opmerkingen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fout bij het toevoegen van de opmerking");
    }
    return await response.json();
};

export const fetchAllSchades = async () => {
    const response = await fetch(`${api_url}/Schades`);
    if (!response.ok) {
        throw new Error("Fout bij het ophalen van alle schades.");
    }
    return await response.json();
};

export const updateSchadeStatus = async (schadeId, newStatus) => {
    const response = await fetch(`${api_url}/Schades/${schadeId}/Status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStatus),
    });
    if (!response.ok) {
        throw new Error("Fout bij het bijwerken van de schade status.");
    }
    return await response.json();
};

export const addReparatieOpmerking = async (schadeId, opmerking) => {
    const response = await fetch(`${api_url}/Schades/${schadeId}/Opmerkingen`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(opmerking),
    });
    if (!response.ok) {
        throw new Error("Fout bij het toevoegen van de reparatieopmerking.");
    }
    return await response.json();
};


export const fetchBeschikbareReparaties = async () => {
    const response = await fetch(`${api_url}/Schades/BeschikbareReparaties`);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Fout bij het ophalen van beschikbare reparaties.");
    }
    return await response.json();
};

export const koppelReparatieAanSchade = async (schadeId, reparatieDetails) => {
    const response = await fetch(`${api_url}/Schades/${schadeId}/KoppelReparatie`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reparatieDetails),
    });
    if (!response.ok) {
        throw new Error("Fout bij het koppelen van de reparatie.");
    }
    return await response.json();
};

export const addSchadeClaim = async (schadeclaim) => {
    const response = await fetch(`${api_url}/Schades/AddClaim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schadeclaim),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Fout bij het toevoegen van de schadeclaim.");
    }
    return await response.json();
};


export const fetchAllVehicles = async () => {
    const response = await fetch(`${api_url}/Vehicles`);
    if (!response.ok) {
        throw new Error("Fout bij het ophalen van beschikbare voertuigen.");
    }
    return await response.json();
};

export const blokkeerVoertuig = async (vehicleId, reden) => {
    const response = await fetch(`${api_url}/Vehicles/${vehicleId}/Blokkeer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reden),
    });
    if (!response.ok) {
        throw new Error("Fout bij het blokkeren van het voertuig.");
    }
    return await response.json();
};

export const deblokkeerVoertuig = async (vehicleId) => {
    const response = await fetch(`${api_url}/Vehicles/${vehicleId}/Deblokkeer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
        throw new Error("Fout bij het deblokkeren van het voertuig.");
    }
    return await response.json();
};
