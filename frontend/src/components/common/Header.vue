<template>
  <nav class="navbar navbar-expand-lg px-3 text-white" :style="headerStyle">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center gap-2 text-white"
        :to="isAuthenticated ? '/dashboard' : '/'" title="Accueil">
        <strong>CesiZen</strong>
      </router-link>
      <div class="d-flex gap-2 ms-auto align-items-center">
        <!-- Dropdown Menu -->
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle" title="Menu" type="button" id="menuDropdown"
            data-bs-toggle="dropdown" aria-expanded="false">
            <font-awesome-icon icon="bars" />
          </button>
          <ul class="dropdown-menu" aria-labelledby="menuDropdown">
            <li>
              <router-link class="dropdown-item" to="/menu">Menu</router-link>
            </li>
            <li v-for="menu in menus" :key="menu.id">
              <router-link class="dropdown-item" :to="`/menu/${menu.id}`">
                {{ menu.title }}
              </router-link>
            </li>
          </ul>
        </div>
        <!-- Émotions & Journal -->
        <router-link class="btn btn-outline-light" to="/emotions" title="Tracker">😊</router-link>
        <router-link class="btn btn-outline-light" to="/journal" title="Journal"><font-awesome-icon
            icon="book-open" /></router-link>
        <!-- Admin (si admin) -->
        <router-link v-if="requireAdmin" class="btn btn-outline-danger" to="/admin">🛡️</router-link>
        <!-- Auth -->
        <router-link :to="isAuthenticated ? '/profil' : '/login'" class="btn btn-outline-light"
          :title="isAuthenticated ? 'Profil' : 'Connexion'">
          <font-awesome-icon :icon="isAuthenticated ? 'user' : 'circle-user'" />
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../../stores/userStore'
import { useMenuStore } from '../../stores/menuStore'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const menuStore = useMenuStore()
const router = useRouter()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const requireAdmin = computed(() => userStore.requireAdmin)
const menus = computed(() => menuStore.menus)


const headerStyle = {
  background: 'linear-gradient(to right, #28a745, #007bff, #ffc107)',
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
}

onMounted(() => {
  menuStore.fetchMenus()
})
</script>

<style scoped>
.navbar-brand strong {
  font-size: 1.2rem;
  color: white;
}
a {
  text-decoration: none;
}
a:hover {
  opacity: 0.9;
}
</style>
