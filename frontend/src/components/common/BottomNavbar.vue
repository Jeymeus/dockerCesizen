<template>
  <nav class="navbar fixed-bottom custom-bottom-navbar d-flex justify-content-around">
    <router-link to="/menu" class="nav-link-custom text-center">
      <i class="bi bi-list"></i><br />Menu
    </router-link>
    <router-link to="/emotions" class="nav-link-custom text-center">
      <i class="bi bi-emoji-smile"></i><br />Émotions
    </router-link>
    <router-link to="/journal" class="nav-link-custom text-center">
      <i class="bi bi-journal-text"></i><br />Journal
    </router-link>
  </nav>
</template>


<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()
const requireAdmin = computed(() => userStore.requireAdmin)

</script>

<style scoped>
.nav-link {
  font-size: 0.8rem;
  padding: 0.3rem;
}
.navbar {
  height: 60px;
}

.custom-bottom-navbar {
  background: linear-gradient(to right, #28a745, #007bff, #ffc107);
  height: 60px;
  border-top: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
}

.nav-link-custom {
  color: white;
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link-custom:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
  text-decoration: none;
}
</style>
