<template>
  <div v-if="visible" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
    <div class="modal-dialog">
      <div class="modal-content">
        <form @submit.prevent="submitEdit">
          <div class="modal-header">
            <h5 class="modal-title">Modifier le menu</h5>
            <button type="button" class="btn-close" @click="close" />
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="menuTitle" class="form-label">Titre</label>
              <input type="text" id="menuTitle" v-model="form.title" class="form-control" required />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button" @click="close">Annuler</button>
            <button class="btn btn-primary" type="submit">Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { update } from '../services/adminService'

const props = defineProps({
  visible: Boolean,
  menu: Object
})

const emit = defineEmits(['close', 'updated'])

const form = ref({ title: '' })

watch(() => props.menu, (val) => {
  if (val) form.value.title = val.title
})

const close = () => emit('close')

const submitEdit = async () => {
  try {
    await update('menus', props.menu.id, { title: form.value.title }) // Utilisation de la méthode générique update
    emit('updated') // Parent recharge
    close()
  } catch (err) {
    alert("Erreur lors de l'enregistrement")
    console.error(err)
  }
}
</script>
