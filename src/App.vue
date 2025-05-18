<template>
  <div class="d-flex flex-column min-vh-100">

    <!-- Header uniquement desktop -->
    <div class="d-none d-md-block">
      <Header />
    </div>

    <!-- Header mobile -->
    <div class="d-md-none">
      <HeaderMobile />
    </div>

    <!-- Contenu principal -->
    <main class="flex-grow-1 pb-mobile">
      <div class="d-md-none px-3">
        <RouterView />
      </div>
      <div class="d-none d-md-block">
        <RouterView />
      </div>
    </main>


    <!-- Footer -->
    <Footer :class="['d-none d-md-block', { 'mt-4': !isAdminRoute }]" />

    <!-- Navbar bottom (mobile) -->
    <div class="d-md-none">
      <BottomNavbar />
    </div>
  </div>
</template>

<script setup>
import Header from './components/common/Header.vue'
import Footer from './components/common/Footer.vue'
import BottomNavbar from './components/common/BottomNavbar.vue'
import HeaderMobile from './components/common/HeaderMobile.vue'

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

</script>

<style scoped>
@media (max-width: 767px) {
  .pb-mobile {
    padding-bottom: 70px;
    /* un peu plus que la hauteur de la navbar (60px) */
  }
}
</style>
