<template>
    <div class="d-flex min-vh-100">
        <!-- SIDEBAR -->
        <AdminSidebar :activeSection="section" @changeSection="changeSection" />

        <!-- CONTENU PRINCIPAL -->
        <div class="flex-grow-1 p-4 ms-sidebar">
            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4"
                style="background-color: #fff; border-radius: 5px; padding: 10px;">
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-outline-secondary" @click="goBack">
                        <font-awesome-icon icon="arrow-left" />
                    </button>
                    <h4 class="mb-0">
                        Édition de : {{ sectionLabels[section] }} #{{ id }}
                    </h4>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-danger" @click="goBack">
                        ❌ Annuler
                    </button>
                    <button class="btn btn-primary" @click="saveItem">
                        💾 Enregistrer
                    </button>
                </div>
            </div>

            <!-- FORMULAIRE -->
            <div class="card shadow">
                <div class="card-body">
                    <form @submit.prevent="saveItem">
                        <div v-for="col in descriptor.columns" :key="col.key"
                            class="mb-3 d-flex gap-2 justify-content-start align-items-center flex-wrap">
                            <label :for="col.key" class="form-label" style="width: 10%;">{{ col.label }} :</label>

                            <!-- Toggle -->
                            <div v-if="isToggle(col.key)">
                                <div class="form-check form-switch">
                                    <input type="checkbox" class="form-check-input" :id="col.key"
                                        v-model="form[col.key]" :checked="form[col.key] === 1"
                                        @change="form[col.key] = $event.target.checked ? 1 : 0" />
                                </div>
                            </div>

                            <!-- Readonly (id) -->
                            <input v-else-if="isReadonly(col.key)" type="text" class="form-control bg-light text-muted"
                                style="width: 85%;" :id="col.key" :value="form[col.key]" disabled />

                            <!-- Select role -->
                            <select v-else-if="isSelectField(col.key)" class="form-select" style="width: 85%;"
                                :id="col.key" v-model="form[col.key]">
                                <option v-for="opt in getSelectOptions(col.key)" :key="opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>

                            <!-- Select menu_id -->
                            <select v-else-if="isMenuSelect(col.key)" class="form-select" style="width: 85%;"
                                :id="col.key" v-model.number="form[col.key]">
                                <option :value="null" disabled>-- Choisir un menu --</option>
                                <option v-for="opt in menuOptions" :key="opt.value" :value="opt.value">
                                    {{ opt.label }}
                                </option>
                            </select>

                            <!-- Select type (pour menus) -->
                            <select v-else-if="isMenuTypeSelect(col.key)" class="form-select" style="width: 85%;"
                                :id="col.key" v-model="form[col.key]">
                                <option disabled value="">-- Choisir un type --</option>
                                <option value="articles">Articles</option>
                                <option value="videos">Vidéos</option>
                                <option value="podcasts">Podcasts</option>
                                <option value="images">Images</option>
                            </select>

                            <!-- Multiline -->
                            <textarea v-else-if="isMultiline(col.key)" class="form-control" style="width: 85%;" rows="4"
                                :id="col.key" v-model="form[col.key]" />

                            <!-- Texte simple -->
                            <input v-else type="text" class="form-control" style="width: 85%;" :id="col.key"
                                v-model="form[col.key]" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminSidebar from '../../components/admin/AdminSidebar.vue'
import * as AdminAPI from '../../services/adminService'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const route = useRoute()
const router = useRouter()

const menuOptions = ref([])

const changeSection = (newSection) => {
    router.push({ path: '/admin', query: { section: newSection } })
}

const section = ref(route.params.section)
const id = ref(route.params.id)
const form = ref({})
const loading = ref(false)

const sectionLabels = {
    users: 'Utilisateur',
    menus: 'Menu',
    pages: 'Page',
    emotions: 'Émotion'
}

const isReadonly = (key) => ['id', 'created_at', 'updated_at', 'count_view'].includes(key)
const isSelectField = (key) => key === 'role'
const isMenuSelect = (key) => section.value === 'pages' && key === 'menu_id'
const isMenuTypeSelect = (key) => section.value === 'menus' && key === 'type'
const isToggle = (key) => ['visible', 'active'].includes(key)
const isMultiline = (key) => ['content', 'note'].includes(key)

const getSelectOptions = (key) => {
    if (key === 'role') {
        return [
            { value: 'user', label: 'Utilisateur' },
            { value: 'admin', label: 'Administrateur' }
        ]
    }
    return []
}

const fullDescriptors = {
    users: {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'firstname', label: 'Prénom' },
            { key: 'lastname', label: 'Nom' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Rôle' },
            { key: 'active', label: 'Actif' },
            { key: 'created_at', label: 'Créé le' },
            { key: 'updated_at', label: 'Modifié le' }
        ]
    },
    menus: {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Titre' },
            { key: 'type', label: 'Type' }
        ]
    },
    pages: {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'title', label: 'Titre' },
            { key: 'url', label: 'URL' },
            { key: 'content', label: 'Contenu' },
            { key: 'visible', label: 'Visible' },
            { key: 'count_view', label: 'Nombre de vues' },
            { key: 'menu_id', label: 'Menu' },
            { key: 'created_at', label: 'Créée le' },
            { key: 'updated_at', label: 'Modifiée le' }
        ]
    },
    emotions: {
        columns: [
            { key: 'id', label: 'ID' },
            { key: 'emoji', label: 'Emoji' },
            { key: 'label', label: 'Nom' },
            { key: 'category', label: 'Catégorie' },
            { key: 'created_at', label: 'Créée le' },
            { key: 'updated_at', label: 'Modifiée le' }
        ]
    }
}

const descriptor = computed(() => fullDescriptors[section.value])

const fetchItem = async () => {
    loading.value = true
    try {
        const res = await AdminAPI.getById(section.value, id.value)
        form.value = { ...res.data }
    } catch (err) {
        console.error('Erreur récupération donnée', err)
    } finally {
        loading.value = false
    }

    if (section.value === 'pages') {
        const menus = (await AdminAPI.getAll('menus')).data
        menuOptions.value = menus.map(m => ({
            value: m.id,
            label: m.title
        }))
    }
}

const saveItem = async () => {
    try {
        await AdminAPI.update(section.value, id.value, form.value)
        router.push({ path: '/admin', query: { section: section.value } })
    } catch (err) {
        console.error('Erreur enregistrement', err)
        alert('Erreur lors de l’enregistrement.')
    }
}

const goBack = () => {
    router.push({ path: '/admin', query: { section: section.value } })
}

onMounted(fetchItem)
</script>

<style scoped>
textarea {
    resize: vertical;
}
.card:hover {
    transform: none !important;
    transition: none !important;
}
</style>
  
