describe('Innamepagina Test', () => {
    beforeEach(() => {

        cy.intercept('GET', 'https://localhost:7048/api/Vehicles/VoorInname', {
            statusCode: 200,
            body: [
                { id: 1, merk: 'Toyota', type: 'Corolla', kenteken: 'AB-123-CD', status: 'Verhuurd' },
                { id: 2, merk: 'Ford', type: 'Focus', kenteken: 'EF-456-GH', status: 'Verhuurd' },
            ],
        }).as('fetchVehicles');

        cy.intercept('POST', 'https://localhost:7048/api/Vehicles/Inname/*', {
            statusCode: 200,
            body: { message: 'Inname succesvol geregistreerd.' },
        }).as('registerInname');

        cy.visit('https://localhost:5173/inname');
    });

    it('toont voertuigen die ingenomen moeten worden', () => {
        cy.wait('@fetchVehicles');
        cy.contains('Toyota Corolla').should('exist');
        cy.contains('Ford Focus').should('exist');
    });

    it('registreert een inname zonder schade', () => {
        cy.wait('@fetchVehicles');
        cy.contains('Toyota Corolla').parent().find('button').click();
        cy.wait('@registerInname').its('request.body').should('include', { Status: 'Beschikbaar' });
        cy.contains('Toyota Corolla').should('not.exist');
    });

    it('registreert een inname met schade', () => {
        cy.wait('@fetchVehicles');
        cy.contains('Ford Focus').parent().find('input[type="checkbox"]').check();
        cy.contains('Ford Focus').parent().find('textarea').type('Schade aan de bumper');
        cy.contains('Ford Focus').parent().find('button').click();
        cy.wait('@registerInname').its('request.body').should('include', { Status: 'Met schade' });
        cy.contains('Ford Focus').should('not.exist');
    });
});
