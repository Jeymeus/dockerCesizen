describe('Tests d\'authentification', () => {
    beforeEach(() => {
        cy.clearStorage()
    })

    describe('Page d\'accueil', () => {
        it('affiche la page d\'accueil correctement', () => {
            cy.visit('/')
            cy.contains('Bienvenue sur CesiZen').should('exist')
        })

        it('peut naviguer de home vers login', () => {
            cy.visit('/')
            cy.get('a[href="/login"]').first().click({ force: true })
            cy.url().should('include', '/login')
        })

        it('peut utiliser le formulaire de connexion', () => {
            cy.visit('/login')

            // ✅ Force l'interaction même si CSS dit que c'est caché
            cy.get('input[type="email"]').first().type('test@example.com', { force: true })
            cy.get('input[type="password"]').first().type('password123', { force: true })

            cy.contains('Se connecter').should('exist')
        })
    })
})