<template>
  <div class="container text-center py-5 text-white">
    <h1 class="mb-4">
      Bienvenue sur CesiZen
      <span v-if="user">, {{ user.username }}</span>
    </h1>
    <p class="lead">Votre journal de bien-être à portée de main.</p>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = userStore.user
</script>

<style scoped>
h1 {
  font-weight: bold;
}
p {
  font-size: 1.2rem;
}
</style>
