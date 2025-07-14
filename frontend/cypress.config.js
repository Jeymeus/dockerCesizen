import { defineConfig } from 'cypress'

export default defineConfig({
    e2e: {
        // URL adaptée pour Docker - ajustez selon votre setup
        baseUrl: 'http://localhost:5173',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/e2e.js',
        videosFolder: 'cypress/videos',
        screenshotsFolder: 'cypress/screenshots',
        video: true,
        screenshot: true,
        viewportWidth: 1920,
        viewportHeight: 1080,
        defaultCommandTimeout: 15000, // Augmenté pour Docker
        requestTimeout: 15000,
        responseTimeout: 15000,
        pageLoadTimeout: 30000, // Important pour Docker
        env: {
            // URL adaptée pour votre API dans Docker
            API_URL: 'http://localhost:3000/api',
            TEST_USER_EMAIL: 'test@cesizen.com',
            TEST_USER_PASSWORD: 'TestPassword123!',
            TEST_ADMIN_EMAIL: 'admin@cesizen.com',
            TEST_ADMIN_PASSWORD: 'AdminPassword123!'
        },
        setupNodeEvents(on, config) {
            // Configuration spécifique Docker
            on('before:browser:launch', (browser = {}, launchOptions) => {
                if (browser.name === 'chrome') {
                    // Options Chrome pour Docker
                    launchOptions.args.push('--disable-dev-shm-usage')
                    launchOptions.args.push('--no-sandbox')
                    launchOptions.args.push('--disable-gpu')
                    return launchOptions
                }
            })

            on('task', {
                // Tâche pour nettoyer la base de données de test
                clearDatabase() {
                    return null
                },
                // Tâche pour créer un utilisateur de test
                createTestUser(userData) {
                    return userData
                },
                // Log pour debug Docker
                log(message) {
                    console.log(message)
                    return null
                }
            })
        }
    },
    component: {
        devServer: {
            framework: 'vue',
            bundler: 'vite',
        },
        specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.js'
    }
})