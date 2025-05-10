import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import Journal from '../views/Journal.vue'
import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Page from '../views/Page.vue'
import Profil from '../views/Profil.vue'
import Admin from '../views/Admin.vue'
import { useUserStore } from '../stores/userStore'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/journal',
        name: 'Journal',
        component: Journal,
        meta: { requiresAuth: true }
    },
    {
        path: '/menu',
        name: 'MenuGeneral',
        component: Menu
    },
    {
        path: '/menu/:slug',
        name: 'MenuDetail',
        component: Menu
    },
    {
        path: '/page/:id',
        name: 'PageDetail',
        component: Page
    },
    {
        path: '/profil',
        name: 'Profil',
        component: Profil,
        meta: { requiresAuth: true }
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: { requiresAuth: true, requireAdmin: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/ForgotPassword.vue')
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('../views/ResetPassword.vue')
    },
    ,
    {
        path: '/admin/:section/:id/edit',
        name: 'AdminEdit',
        component: () => import('../views/AdminEdit.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 🔐 Guard pour routes protégées et admin
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    // Recharge le user depuis le token s'il n'est pas encore chargé
    if (!userStore.user && userStore.token) {
        await userStore.loadUserFromToken()
    }

    // 🔐 Authentification requise ?
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        return next('/login')
    }

    // 👮 Autorisation admin requise ?
    if (to.meta.requireAdmin && !userStore.requireAdmin) {
        return next('/login')
    }

    // ✅ Sinon, accès autorisé
    next()
})


export default router
