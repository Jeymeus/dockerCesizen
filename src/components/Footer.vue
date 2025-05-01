<template>
  <footer
    class="text-center text-white"
    :class="footerClass"
    :style="footerStyle"
  >
    <p class="mb-1">&copy; 2025 CesiZen. Tous droits réservés.</p>
    <small>
      <a href="#" class="text-white text-decoration-underline">Mentions légales</a> |
      <a href="#" class="text-white text-decoration-underline">Politique de confidentialité</a>
    </small>
  </footer>
</template>

<script setup>
const footerStyle = {
  background: 'linear-gradient(to right, #28a745, #007bff, #ffc107)',
}

const footerClass = 'py-2 py-md-4' // petit padding mobile, plus grand desktop
</script>
