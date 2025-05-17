import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'

// 🧩 Imports directs
import Login from '../views/auth/Login.vue'
import Dashboard from '../views/public/Dashboard.vue'
import Journal from '../views/journal/Journal.vue'
import Home from '../views/public/Home.vue'
import Menu from '../views/menu/Menu.vue'
import Page from '../views/menu/Page.vue'
import Profil from '../views/user/Profil.vue'
import Admin from '../views/admin/Admin.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/login', name: 'Login', component: Login },

    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
    },
    {
        path: '/emotions',
        name: 'Emotions',
        component: () => import('../views/journal/Emotions.vue')
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
        path: '/menu/:id',
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
        path: '/profil/edit',
        name: 'ProfilEdit',
        component: () => import('../views/user/EditUser.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('../views/auth/ForgotPassword.vue')
    },
    {
        path: '/reset-password/:token',
        name: 'ResetPassword',
        component: () => import('../views/auth/ResetPassword.vue')
    },
    {
        path: '/admin',
        name: 'Admin',
        component: Admin,
        meta: { requiresAuth: true, requireAdmin: true }
    },
    {
        path: '/admin/:section/new',
        name: 'AdminAdd',
        component: () => import('../views/admin/AdminAdd.vue'),
        meta: { requiresAuth: true, requireAdmin: true }
    },
    {
        path: '/admin/:section/:id/edit',
        name: 'AdminEdit',
        component: () => import('../views/admin/AdminEdit.vue'),
        meta: { requiresAuth: true, requireAdmin: true }
    },
    {
        path: '/404',
        name: 'NotFound',
        component: () => import('../views/public/NotFound.vue')
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 🔐 Guard pour routes protégées et admin
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    if (!userStore.user && userStore.token) {
        await userStore.loadUserFromToken()
    }

    // 👮 Bloc spécifique aux routes admin
    if (to.path.startsWith('/admin')) {
        if (!userStore.isAuthenticated || !userStore.requireAdmin) {
            return next({ path: '/404', replace: true })
        }
    }

    // 🔐 Authentification requise ?
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        return next('/login')
    }

    next()
})

export default router
