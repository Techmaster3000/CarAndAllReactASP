describe('Uitgiftepagina Integratietest', () => {
    beforeEach(() => {
        // Mock de API-respons voor huurverzoeken
        cy.intercept('GET', 'https://localhost:7048/api/ParticuliereVerhuurs/dto', {
            statusCode: 200,
            body: [
                {
                    verhuurID: 1,
                    status: 'Approved',
                    voertuig: { merk: 'Toyota', type: 'Corolla', kenteken: 'AB-123-CD' },
                    user: { naam: 'Jan de Vries' },
                },
            ],
        }).as('fetchHuurverzoeken');

        // Mock de API-respons voor het registreren van uitgifte
        cy.intercept('PUT', 'https://localhost:7048/api/ParticuliereVerhuurs/uitgifte/*', {
            statusCode: 200,
            body: { message: 'Uitgifte succesvol geregistreerd!' },
        }).as('registreerUitgifte');

        // Bezoek de uitgiftepagina
        cy.visit('https://localhost:5173/uitgifte');
    });

    it('verandert de status naar uitgegeven en verhuurd na een succesvolle uitgifte', () => {
        // Wacht op de API-respons en controleer of het huurverzoek wordt weergegeven
        cy.wait('@fetchHuurverzoeken');
        cy.contains('Toyota Corolla').should('exist');
        cy.contains('Kenteken: AB-123-CD').should('exist');
        cy.contains('Huurder: Jan de Vries').should('exist');

        cy.get('textarea').type('Voertuig gecontroleerd en in goede staat.');

        cy.contains('Bevestig Uitgifte').click();

        // Wacht op de PUT-aanroep en controleer het succesbericht
        cy.wait('@registreerUitgifte');
        cy.contains('Uitgifte succesvol geregistreerd!').should('be.visible');

        // Controleer dat het huurverzoek is verwijderd van de pagina
        cy.contains('Toyota Corolla').should('not.exist');
    });
});
