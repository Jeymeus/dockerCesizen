// ***********************************************
// Commands personnalisées pour CesiZen
// ***********************************************

// Commande pour se connecter avec un utilisateur
Cypress.Commands.add('login', (email = Cypress.env('TEST_USER_EMAIL'), password = Cypress.env('TEST_USER_PASSWORD')) => {
    // Mock de l'API de connexion
    cy.intercept('POST', '**/api/auth/login', { fixture: 'user.json' }).as('loginAPI')

    cy.visit('/login')
    cy.get('[data-testid="email-input"]').type(email)
    cy.get('[data-testid="password-input"]').type(password)
    cy.get('[data-testid="login-button"]').click()

    cy.wait('@loginAPI')
    cy.url().should('include', '/dashboard')
})

// Commande pour se connecter en tant qu'admin
Cypress.Commands.add('loginAsAdmin', () => {
    cy.intercept('POST', '**/api/auth/login', {
        body: {
            user: { id: 2, firstname: 'Admin', email: 'admin@cesizen.com', role: 'admin' },
            token: 'fake-admin-token'
        }
    }).as('adminLogin')

    cy.login(Cypress.env('TEST_ADMIN_EMAIL'), Cypress.env('TEST_ADMIN_PASSWORD'))
})

// Commande pour se déconnecter
Cypress.Commands.add('logout', () => {
    cy.get('[data-testid="user-menu"]').click()
    cy.get('[data-testid="logout-button"]').click()
    cy.url().should('include', '/')
})

// Commande pour créer une entrée d'émotion
Cypress.Commands.add('createEmotionEntry', (emotion = '😊', date = new Date().toISOString().split('T')[0]) => {
    cy.intercept('POST', '**/api/entries', {
        statusCode: 200,
        body: { id: 1, emotion_id: 1, date_entry: date }
    }).as('createEntry')

    cy.visit('/emotions')
    cy.get('[data-testid="category-select"]').select('Joie')
    cy.get(`[data-testid="emotion-button-${emotion}"]`).click()
    cy.wait('@createEntry')
})

// Commande pour nettoyer le localStorage
Cypress.Commands.add('clearStorage', () => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.window().then((win) => {
        win.sessionStorage.clear()
    })
})

// Commande pour intercepter les appels API
Cypress.Commands.add('mockApi', (method, url, fixture) => {
    cy.intercept(method, `${Cypress.env('API_URL')}${url}`, { fixture })
})

// Commande pour attendre le chargement complet de la page
Cypress.Commands.add('waitForPageLoad', () => {
    cy.get('[data-testid="loading"]', { timeout: 10000 }).should('not.exist')
    cy.get('body').should('be.visible')
})

// Commande pour naviguer avec le menu mobile
Cypress.Commands.add('navigateMobile', (section) => {
    cy.viewport(375, 667)
    cy.get(`[data-testid="mobile-nav-${section}"]`).click()
})

// Commande pour remplir le formulaire d'inscription
Cypress.Commands.add('fillRegistrationForm', (userData = {}) => {
    const defaultData = {
        firstname: 'Test',
        lastname: 'User',
        email: 'test@example.com',
        password: 'TestPassword123!',
        confirmPassword: 'TestPassword123!'
    }

    const data = { ...defaultData, ...userData }

    cy.get('[data-testid="register-tab"]').click()
    cy.get('[data-testid="firstname-input"]').type(data.firstname)
    cy.get('[data-testid="lastname-input"]').type(data.lastname)
    cy.get('[data-testid="email-input"]').clear().type(data.email)
    cy.get('[data-testid="password-input"]').type(data.password)
    cy.get('[data-testid="confirm-password-input"]').type(data.confirmPassword)
})

// Commande pour vérifier la présence d'une notification
Cypress.Commands.add('checkNotification', (message, type = 'success') => {
    cy.get(`[data-testid="notification-${type}"]`)
        .should('be.visible')
        .and('contain', message)
})

// Commande pour créer un menu via l'admin
Cypress.Commands.add('createMenu', (menuData) => {
    cy.intercept('POST', '**/api/menus', {
        statusCode: 200,
        body: { id: 1, ...menuData }
    }).as('createMenu')

    cy.visit('/admin')
    cy.get('[data-testid="admin-section-menus"]').click()
    cy.get('[data-testid="add-menu-button"]').click()
    cy.get('[data-testid="menu-title-input"]').type(menuData.title)
    cy.get('[data-testid="menu-type-select"]').select(menuData.type)
    cy.get('[data-testid="save-menu-button"]').click()
    cy.wait('@createMenu')
})

// Commande pour mock l'authentification complète
Cypress.Commands.add('mockAuth', () => {
    cy.intercept('GET', '**/api/users/me', { fixture: 'user.json' }).as('getUser')
    cy.intercept('GET', '**/api/emotions', { fixture: 'emotions.json' }).as('getEmotions')
    cy.intercept('GET', '**/api/entries', { body: [] }).as('getEntries')
    cy.intercept('GET', '**/api/menus', { body: [] }).as('getMenus')

    // Simuler le token dans localStorage
    cy.window().then((win) => {
        win.localStorage.setItem('token', 'fake-jwt-token')
    })
})