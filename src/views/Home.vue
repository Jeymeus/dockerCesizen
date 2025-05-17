<template>
  <div class="home-wrapper d-flex align-items-center justify-content-center">
    <div class="home-container text-center text-dark">
      <div class="welcome-card shadow-sm">
        <h1 class="rainbow-title mb-3">
          Bienvenue sur <strong>CesiZen</strong>
          <span v-if="user">, {{ user.username }}</span>
        </h1>

        <p class="fs-5">
          ✨ Une application conçue pour vous aider à explorer vos émotions, mieux vous comprendre, et avancer avec
          sérénité. ✨
        </p>

        <p class="mt-4">
          🌿 Écoutez-vous. Ressentez. Notez vos émotions jour après jour.<br />
          📘 Créez votre journal de bien-être et suivez votre évolution intérieure.<br />
          😊 Apprenez à reconnaître les émotions qui vous traversent, pour mieux vivre avec elles.
        </p>

        <p class="mt-4 fst-italic text-muted">
          "Prendre soin de soi commence par l’écoute de ce que l’on ressent."
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()
const user = userStore.user
</script>

<style scoped>
.home-wrapper {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.home-container {
  max-width: 800px;
  font-family: 'Dancing Script', cursive;
}

.welcome-card {
  background-color: #fff8e6;
  padding: 2rem;
  border-radius: 20px;
}

.rainbow-title {
  font-size: 2.2rem;
  font-weight: bold;
  background: linear-gradient(to right,
      #ff4e50,
      #fc913a,
      #f9d423,
      #e2f356,
      #7ed957,
      #00c9a7,
      #2e86de,
      #9b59b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
