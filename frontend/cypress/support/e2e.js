// ***********************************************************
// Support file pour les tests E2E
// ***********************************************************

// Import des commandes personnalisées
import './commands'

// Configuration globale avant chaque test
beforeEach(() => {
    // Nettoyer le storage avant chaque test
    cy.clearStorage()

    // ✅ Intercepter les appels d'API spécifiques pour CesiZen
    cy.intercept('GET', '**/api/users/me', {
        statusCode: 401,
        body: { error: 'Non authentifié' }
    }).as('userMe')

    cy.intercept('GET', '**/api/menus', {
        statusCode: 200,
        body: []
    }).as('menus')

    cy.intercept('GET', '**/api/emotions', {
        statusCode: 200,
        body: []
    }).as('emotions')

    cy.intercept('GET', '**/api/entries', {
        statusCode: 200,
        body: []
    }).as('entries')

    cy.intercept('GET', '**/api/pages', {
        statusCode: 200,
        body: []
    }).as('pages')

    // ✅ Intercepter les autres appels d'API génériques
    cy.intercept('GET', '**/api/**', { fixture: 'empty.json' }).as('apiCall')

    // ✅ Intercepter les appels qui peuvent échouer
    cy.intercept('POST', '**/api/**', { fixture: 'empty.json' }).as('apiPost')
    cy.intercept('PUT', '**/api/**', { fixture: 'empty.json' }).as('apiPut')
    cy.intercept('DELETE', '**/api/**', { fixture: 'empty.json' }).as('apiDelete')
})

// Gestion des erreurs non capturées
Cypress.on('uncaught:exception', (err, runnable) => {
    // Ignorer certaines erreurs non critiques pour les tests
    if (err.message.includes('ResizeObserver loop limit exceeded')) {
        return false
    }
    if (err.message.includes('Script error')) {
        return false
    }
    if (err.message.includes('NetworkError')) {
        return false
    }
    if (err.message.includes('fetch')) {
        return false
    }
    if (err.message.includes('Request failed')) {
        return false
    }
    return true
})

// Configuration pour les tests sur mobile
Cypress.Commands.add('setMobileViewport', () => {
    cy.viewport(375, 667) // iPhone 6/7/8
})

// Configuration pour les tests sur desktop  
Cypress.Commands.add('setDesktopViewport', () => {
    cy.viewport(1920, 1080) // ✅ Full HD moderne
})

// Utilitaire pour attendre les animations Bootstrap
Cypress.Commands.add('waitForBootstrapAnimation', () => {
    cy.wait(300) // Attendre la fin des transitions Bootstrap
})

// ✅ Nouvelle commande pour attendre le chargement complet de Vue
Cypress.Commands.add('waitForVueApp', () => {
    // Attendre que le header soit visible
    cy.get('[data-testid="header"]', { timeout: 10000 }).should('be.visible')

    // Attendre que les appels API initiaux soient terminés
    cy.wait(['@userMe', '@menus'], { timeout: 5000 })

    // Petit délai pour l'hydratation complète
    cy.wait(500)
})

// ✅ Commande pour mock un utilisateur connecté
Cypress.Commands.add('mockAuthenticatedUser', () => {
    cy.intercept('GET', '**/api/users/me', {
        statusCode: 200,
        body: {
            id: 1,
            firstname: 'Test',
            lastname: 'User',
            email: 'test@cesizen.com',
            role: 'user'
        }
    }).as('authenticatedUser')

    // Simuler le token dans localStorage
    cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token-for-tests')
    })
})