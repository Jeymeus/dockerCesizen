describe('Tests des émotions', () => {
    beforeEach(() => {
        cy.clearStorage()

        // Mock des API essentielles
        cy.intercept('GET', '**/api/users/me', {
            statusCode: 200,
            body: { id: 1, firstname: 'Test', email: 'test@example.com' }
        })

        cy.intercept('GET', '**/api/emotions', {
            statusCode: 200,
            body: [
                { id: 1, emoji: '😊', label: 'Joie', category: 'Joie' },
                { id: 2, emoji: '😢', label: 'Tristesse', category: 'Tristesse' },
                { id: 3, emoji: '😡', label: 'Colère', category: 'Colère' }
            ]
        })

        cy.intercept('GET', '**/api/entries', {
            statusCode: 200,
            body: []
        })

        // Simuler une connexion
        cy.window().then((win) => {
            win.localStorage.setItem('token', 'fake-jwt-token')
        })
    })

    describe('Page des émotions', () => {
        it('peut accéder à la page émotions', () => {
            cy.visit('/emotions')
            cy.contains('Émotion du jour').should('exist')
        })

        it('affiche le calendrier', () => {
            cy.visit('/emotions')
            // Chercher des éléments du calendrier v-calendar
            cy.get('.vc-container').should('be.visible')
        })

        it('affiche les catégories', () => {
            cy.visit('/emotions')
            cy.get('select').should('be.visible')
            cy.contains('Catégorie').should('exist')
        })

        it('peut naviguer entre les jours', () => {
            cy.visit('/emotions')
            // Chercher les boutons de navigation
            cy.contains('⬅️').click({ force: true })
            cy.contains('➡️').click({ force: true })
        })
    })

    describe('Tests basiques', () => {
        it('fonctionne sur mobile', () => {
            cy.viewport(375, 667)
            cy.visit('/emotions')
            cy.contains('Émotion').should('exist')
        })

        it('gère les erreurs gracieusement', () => {
            cy.intercept('GET', '**/api/emotions', {
                statusCode: 500,
                body: { error: 'Erreur serveur' }
            })

            cy.visit('/emotions')
            // La page doit quand même se charger
            cy.get('body').should('be.visible')
        })
    })
})