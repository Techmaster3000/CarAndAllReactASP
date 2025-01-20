describe('SchadeclaimsPage - Voeg Schadeclaim Toe', () => {
    beforeEach(() => {
        // Stel een mock API-server in om de backend te simuleren
        cy.intercept('POST', '/api/AddClaim', (req) => {
            const body = req.body;
            if (!body.Kenteken || !body.Beschrijving) {
                req.reply({
                    statusCode: 400,
                    body: { message: 'Kenteken en beschrijving zijn verplicht.' },
                });
            } else {
                req.reply({
                    statusCode: 200,
                    body: {
                        message: 'Schadeclaim succesvol toegevoegd en Voertuigstatus op in reparatie gezet',
                    },
                });
            }
        });

        cy.visit('https://localhost:5173/schadeclaims');
    });

    it('Moet een nieuwe schadeclaim succesvol toevoegen', () => {
        // Open het formulier om een nieuwe schadeclaim toe te voegen
        cy.contains('+ Open nieuwe claim formulier').click();
        
        cy.get('input[placeholder="Bijvoorbeeld: AB-123-CD"]').type('AB-123-CD');
        cy.get('textarea[placeholder="Beschrijf de schade"]').type('Kras op de bumper');

        cy.contains('Voeg claim toe').click();

        cy.contains('Schadeclaim succesvol toegevoegd en Voertuigstatus op in reparatie gezet').should('be.visible');

        cy.contains('+ Open nieuwe claim formulier').click();
        // Controleer of het formulier wordt gereset
        cy.get('input[placeholder="Bijvoorbeeld: AB-123-CD"]').should('have.value', '');
        cy.get('textarea[placeholder="Beschrijf de schade').should('have.value', '');
    });

    it('Moet een foutmelding geven bij ontbrekende gegevens', () => {
        cy.contains('+ Open nieuwe claim formulier').click();

        cy.get('input[placeholder="Bijvoorbeeld: AB-123-CD"]').type('AB-123-CD');

        cy.contains('Voeg claim toe').click();

        cy.contains('Kenteken en beschrijving zijn verplicht.').should('be.visible');
    });
});
