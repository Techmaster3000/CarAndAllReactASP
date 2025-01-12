describe('Schademeldingenpagina Test', () => {
    beforeEach(() => {

        cy.intercept('GET', 'https://localhost:7048/api/Schades/Schades', {
            statusCode: 200,
            body: [
                {
                    vehicleId: 1,
                    merk: 'Toyota',
                    type: 'Corolla',
                    kenteken: 'AB-123-CD',
                    status: 'Met schade',
                    schades: [
                        {
                            id: 101,
                            datum: '2025-01-01T00:00:00Z',
                            opmerkingen: 'Kras op de bumper',
                            fotoUrl: null,
                            status: 'Nieuw',
                        },
                    ],
                },
                {
                    vehicleId: 2,
                    merk: 'Ford',
                    type: 'Focus',
                    kenteken: 'EF-456-GH',
                    status: 'Met schade',
                    schades: [
                        {
                            id: 102,
                            datum: '2025-01-02T00:00:00Z',
                            opmerkingen: 'Deuk aan de zijkant',
                            fotoUrl: 'https://via.placeholder.com/150',
                            status: 'Nieuw',
                        },
                    ],
                },
            ],
        }).as('fetchSchades');

        cy.intercept('PUT', 'https://localhost:7048/api/Schades/VoertuigStatus/*', {
            statusCode: 200,
            body: { message: 'Status succesvol bijgewerkt.' },
        }).as('updateStatus');

        cy.intercept('POST', 'https://localhost:7048/api/Schades/Schade/*/Opmerkingen', {
            statusCode: 200,
            body: { message: 'Opmerking succesvol toegevoegd.' },
        }).as('addComment');

        cy.visit('https://localhost:5173/schades');
    });

    it('toont voertuigen met nieuwe schades', () => {
        cy.wait('@fetchSchades');
        cy.contains('Toyota Corolla').should('exist');
        cy.contains('Ford Focus').should('exist');
        cy.contains('Kras op de bumper').should('exist');
        cy.contains('Deuk aan de zijkant').should('exist');
    });

    it('voegt een opmerking toe aan een schade', () => {
        cy.wait('@fetchSchades');
        cy.contains('Kras op de bumper')
            .parent()
            .find('textarea')
            .type('Controleer ASAP');
        cy.contains('Kras op de bumper')
            .parent()
            .find('button')
            .contains('Voeg opmerking toe')
            .click();

        cy.wait('@addComment').its('request.body').should('eq', 'Controleer ASAP');
        cy.contains('Opmerking succesvol toegevoegd.').should('be.visible');
    });

    it('werkt de voertuigstatus bij naar "In reparatie"', () => {
        cy.wait('@fetchSchades');
        cy.contains('Toyota Corolla')
            .parent()
            .find('button')
            .contains('Zet status op "In reparatie"')
            .click();

        cy.wait('@updateStatus')
            .its('request.body')
            .should('eq', 'In reparatie');
        cy.contains('Status succesvol bijgewerkt.').should('be.visible');
    });
});
