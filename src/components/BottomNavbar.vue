<template>
  <nav class="navbar fixed-bottom bg-light border-top shadow-sm d-flex justify-content-around">
    <router-link to="/menu" class="nav-link text-center">
      <i class="bi bi-list"></i><br />Menu
    </router-link>
    <router-link to="/emotions" class="nav-link text-center">
      <i class="bi bi-emoji-smile"></i><br />Émotions
    </router-link>
    <router-link to="/journal" class="nav-link text-center">
      <i class="bi bi-journal-text"></i><br />Journal
    </router-link>
    <router-link
      v-if="isAdmin"
      to="/admin"
      class="nav-link text-center text-danger"
    >
      <i class="bi bi-shield-lock"></i><br />Admin
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

</script>

<style scoped>
.nav-link {
  font-size: 0.8rem;
  padding: 0.3rem;
}
.navbar {
  height: 60px;
}
</style>
