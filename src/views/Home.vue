<template>
  <div class="container text-center py-5">
    <h1 class="mb-4">Bienvenue sur CesiZen</h1>
    <p class="lead">Votre journal de bien-être à portée de main.</p>

    <div class="mt-5">
      <router-link to="/login" class="btn btn-primary btn-lg mx-2">Se connecter</router-link>
      <router-link to="/register" class="btn btn-success btn-lg mx-2">S'inscrire</router-link>
    </div>
  </div>
</template>

<script setup>
// Simple home page for visitors
</script>

<style scoped>
h1 {
  font-weight: bold;
}
p {
  font-size: 1.2rem;
}
</style>
