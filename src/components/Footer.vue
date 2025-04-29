<template>
  <footer class="text-center py-4 text-white" :style="footerStyle">
    <p class="mb-1">&copy; 2025 CesiZen. Tous droits réservés.</p>
    <small>
      <a href="#" class="text-white text-decoration-underline">Mentions légales</a> |
      <a href="#" class="text-white text-decoration-underline">Politique de confidentialité</a>
      <!-- <a href="#" class="text-white text-decoration-underline">RGPD</a> -->
    </small>
  </footer>
</template>

<script setup>
// Footer with gradient background and legal links
const footerStyle = {
  background: 'linear-gradient(to right, #28a745, #007bff, #ffc107)' // vert → bleu → jaune
}
</script>

<style scoped>
a:hover {
  text-decoration: none;
  opacity: 0.9;
}
</style>