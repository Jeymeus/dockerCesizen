<template>
  <nav class="navbar navbar-expand-lg px-3 text-white" :style="headerStyle">
    <div class="container-fluid">
      <router-link class="navbar-brand d-flex align-items-center gap-2 text-white" to="/">
        <strong>CesiZen</strong>
      </router-link>

      <div class="d-flex gap-2 ms-auto align-items-center">
        <div class="dropdown">
          <button class="btn btn-outline-light dropdown-toggle" type="button" id="menuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Menu
          </button>
          <ul class="dropdown-menu" aria-labelledby="menuDropdown">
            <li>
              <router-link class="dropdown-item" to="/menu">Général</router-link>
            </li>
            <li v-for="menu in menus" :key="menu.id">
              <router-link class="dropdown-item" :to="`/menu/${menu.slug}`">{{ menu.title }}</router-link>
            </li>
          </ul>
        </div>

        <router-link v-if="!isAuthenticated" class="btn btn-outline-light" to="/login">Connexion</router-link>
        <router-link v-if="!isAuthenticated" class="btn btn-outline-light" to="/register">Inscription</router-link>
        <button v-if="isAuthenticated" @click="logout" class="btn btn-outline-light">Se déconnecter</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'
import { useMenuStore } from '../stores/menuStore'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

const userStore = useUserStore()
const menuStore = useMenuStore()
const router = useRouter()

const isAuthenticated = computed(() => userStore.isAuthenticated)
const menus = computed(() => menuStore.menus)

const logout = () => {
  userStore.logout()
  router.push('/login')
}

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
