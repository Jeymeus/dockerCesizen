<template>
  <div class="d-flex flex-column min-vh-100">
    
    <!-- Header uniquement desktop -->
    <div class="d-none d-md-block">
      <Header />
    </div>

    <!-- Logo top gauche mobile -->
    <div class="d-md-none ps-3 pt-2">
      <strong>CesiZen</strong>
    </div>

    <!-- Contenu principal -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <Footer />

    <!-- Navbar bottom (mobile) -->
    <div class="d-md-none">
      <BottomNavbar />
    </div>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import BottomNavbar from './components/BottomNavbar.vue'
</script>
