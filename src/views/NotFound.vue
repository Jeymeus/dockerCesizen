<template>
    <div class="notfound-container">
        <img src="@/assets/images/404.png" alt="Erreur 404 - Impasse" class="notfound-image" />
        <router-link to="/" class="btn btn-warning mt-3">
            ⟵ Retour à l'accueil
        </router-link>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
    const footer = document.querySelector('footer')
    if (footer) {
        footer.classList.remove('mt-4')
    }
})
</script>

<style scoped>
.notfound-container {
    position: fixed;
    inset: 0;
    background-color: #fffaf3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.notfound-image {
    max-height: 60vh;
    max-width: 80vw;
    object-fit: contain;
}

footer {
    margin: 0 !important;
}
</style>
  
