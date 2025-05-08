<template>
  <div class="admin-sidebar d-flex flex-column text-white p-3">
    <button
      v-for="item in sections"
      :key="item.key"
      class="btn text-white d-flex align-items-center gap-2 mb-3 w-100"
      :class="{ 'active-btn': activeSection === item.key }"
      @click="$emit('changeSection', item.key)"
    >
      <font-awesome-icon :icon="item.icon" />
      <span class="d-none d-md-inline">{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps({
  activeSection: String
})

const sections = [
  { key: 'users', icon: 'user', label: 'Utilisateurs' },
  { key: 'menus', icon: 'bars', label: 'Menus' },
  { key: 'pages', icon: 'file-alt', label: 'Pages' },
  { key: 'emotions', icon: 'face-smile', label: 'Émotions' }
]
</script>

<style scoped>
.admin-sidebar {
  width: 200px;
  min-height: 100vh;
  background: #28a745;
}


button.active-btn {
  background-color: rgba(255, 255, 255, 0.15);
  font-weight: bold;
}

button:hover {
  background-color: rgba(255, 255, 255, 0.25);
}
</style>
