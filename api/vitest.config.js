import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        globals: true,
        env: {
            NODE_ENV: 'test',
            VITEST: 'true'
        },
        setupFiles: ['./tests/setup/testTables.js'],
        globalSetup: './tests/setup/globalSetup.js',
        globalTeardown: './tests/setup/globalTeardown.js',
        // ✅ CORRECTION: Forcer l'exécution séquentielle
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true  // Un test à la fois
            }
        },
        testTimeout: 15000,  // Timeout plus long
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'tests/',
                'coverage/',
                '**/*.test.js'
            ]
        }
    }
})