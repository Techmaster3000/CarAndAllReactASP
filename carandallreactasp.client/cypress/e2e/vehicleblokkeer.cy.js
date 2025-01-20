describe('VehicleBeheerPage - Voertuigen Blokkeren & Deblokkeren', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://localhost:7048/api/Vehicles', [
            {
                id: 1,
                merk: 'Toyota',
                type: 'Corolla',
                kenteken: 'AB-123-CD',
                status: 'Beschikbaar',
            },
            {
                id: 2,
                merk: 'Ford',
                type: 'Focus',
                kenteken: 'EF-456-GH',
                status: 'Geblokkeerd',
            },
        ]).as('getVehicles');

        cy.intercept('PUT', 'https://localhost:7048/api/Vehicles/1/Blokkeer', {
            statusCode: 200,
            body: { message: 'Voertuig succesvol geblokkeerd.' },
        }).as('blokkeerVoertuig');

        cy.intercept('PUT', 'https://localhost:7048/api/Vehicles/2/Deblokkeer', {
            statusCode: 200,
            body: { message: 'Voertuig succesvol gedeblokkeerd.' },
        }).as('deblokkeerVoertuig');

        cy.visit('https://localhost:5173/vehiclebeheer');
        cy.wait('@getVehicles');
    });

    it('Moet een voertuig succesvol blokkeren', () => {
        cy.get('textarea[placeholder="Reden voor blokkeren"]').type('Onderhoud vereist');

        cy.contains('Blokkeer Voertuig').click();

        cy.wait('@blokkeerVoertuig');
        cy.contains('Voertuig succesvol geblokkeerd.').should('be.visible');
    });

   it('Moet een voertuig succesvol deblokkeren', () => {
    cy.contains('Deblokkeer Voertuig').click();

    cy.wait('@deblokkeerVoertuig');
    cy.contains('Voertuig succesvol gedeblokkeerd.').should('be.visible');

});

    it('Moet een foutmelding geven bij het blokkeren zonder reden', () => {
        cy.contains('Blokkeer Voertuig').click();

        cy.contains('Reden voor blokkeren is verplicht.').should('be.visible');
    });

    it('Moet voertuigen filteren op status', () => {
        cy.get('.vehicle-list li').should('have.length', 2);

        cy.get('#filter').select('Geblokkeerd');

        cy.get('.vehicle-list li').should('have.length', 1);
        cy.contains('Ford Focus');

        cy.contains('Toyota Corolla').should('not.exist');
    });
});
