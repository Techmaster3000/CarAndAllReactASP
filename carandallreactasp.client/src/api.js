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
        body: JSON.stringify(gegevens), // Verstuur de opmerkingen bij de uitgifte
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Fout bij het registreren van de uitgifte.');
    }

    return await response.json(); // Retourneer het bijgewerkte huurverzoek na uitgifte
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

    // Verwerk de platte tekst respons
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return { message: text };
    }
};



