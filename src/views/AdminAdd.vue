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
                        Création d’un(e) {{ section }}
                    </h4>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-danger" @click="goBack">
                        ❌ Annuler
                    </button>
                    <button class="btn btn-success" @click="submitForm">
                        ➕ Créer
                    </button>
                </div>
            </div>

            <!-- FORMULAIRE -->
            <div class="card shadow w-100">
                <div class="card-body">
                    <form @submit.prevent="submitForm">
                        <div v-for="col in descriptor.columns" :key="col.key"
                            class="mb-3 d-flex gap-2 justify-content-start align-items-center flex-wrap">
                            <label :for="col.key" class="form-label" style="width: 10%;">{{ col.label }} :</label>

                            <!-- Visible: boolean select -->
                            <select v-if="col.key === 'visible'" :id="col.key" v-model.number="form[col.key]"
                                class="form-select" style="width: 85%;">
                                <option disabled value="">-- Choisir --</option>
                                <option :value="1">Oui</option>
                                <option :value="0">Non</option>
                            </select>

                            <!-- Menu: select from fetched menus -->
                            <select v-else-if="col.key === 'menu_id'" :id="col.key" v-model.number="form[col.key]"
                                class="form-select" style="width: 85%;">
                                <option disabled value="">-- Choisir un menu --</option>
                                <option v-for="menu in menuOptions" :key="menu.value" :value="menu.value">
                                    {{ menu.label }}
                                </option>
                            </select>

                            <!-- Emotion category: fixed options -->
                            <select v-else-if="col.key === 'category'" :id="col.key" v-model="form[col.key]"
                                class="form-select" style="width: 85%;">
                                <option disabled value="">-- Choisir une catégorie --</option>
                                <option value="Joie">Joie</option>
                                <option value="Colère">Colère</option>
                                <option value="Peur">Peur</option>
                                <option value="Tristesse">Tristesse</option>
                                <option value="Surprise">Surprise</option>
                                <option value="Dégoût">Dégoût</option>
                            </select>

                            <!-- Multiline textarea for content -->
                            <textarea v-else-if="col.key === 'content'" :id="col.key" v-model="form[col.key]"
                                class="form-control"
                                style="width: 85%; min-height: 150px; resize: vertical;"></textarea>

                            <!-- Default input -->
                            <input v-else :id="col.key" v-model="form[col.key]" type="text" class="form-control"
                                style="width: 85%;" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as AdminAPI from '../services/adminService'
import AdminSidebar from '../components/AdminSidebar.vue'

const route = useRoute()
const router = useRouter()
const section = ref('')
const form = ref({})
const menuOptions = ref([])

const validEmotionCategories = ['Joie', 'Colère', 'Peur', 'Tristesse', 'Surprise', 'Dégoût']

const fullDescriptors = {
    menus: {
        columns: [
            { key: 'title', label: 'Titre' },
            { key: 'type', label: 'Type' }
        ]
    },
    pages: {
        columns: [
            { key: 'title', label: 'Titre' },
            { key: 'url', label: 'URL' },
            { key: 'content', label: 'Contenu' },
            { key: 'visible', label: 'Visible' },
            { key: 'menu_id', label: 'Menu' }
        ]
    },
    emotions: {
        columns: [
            { key: 'emoji', label: 'Emoji' },
            { key: 'label', label: 'Nom' },
            { key: 'category', label: 'Catégorie' }
        ]
    }
}

const descriptor = computed(() => {
    return fullDescriptors[section.value] ?? { columns: [] }
})

watch(descriptor, async (newVal) => {
    console.log('📦 Descriptor chargé pour', section.value, ':', newVal)
    const obj = {}
    newVal.columns.forEach(col => {
        obj[col.key] = ''
    })
    form.value = obj

    if (section.value === 'pages') {
        try {
            const menus = (await AdminAPI.getAll('menus')).data
            menuOptions.value = menus.map(m => ({ value: m.id, label: m.title }))
        } catch (e) {
            console.error('Erreur chargement menus:', e)
        }
    }
}, { immediate: true })

onMounted(() => {
    section.value = route.params.section || ''
    console.log('🧭 Section détectée depuis l\'URL :', section.value)
})

const submitForm = async () => {
    try {
        if (section.value === 'emotions' && !validEmotionCategories.includes(form.value.category)) {
            alert('❌ Catégorie invalide. Valeur interdite.')
            return
        }
        console.log('📤 Données soumises :', form.value)
        await AdminAPI.create(section.value, form.value)
        router.push({ path: '/admin', query: { section: section.value } })
    } catch (e) {
        console.error('❌ Erreur lors de la soumission :', e)
        alert('Erreur lors de la soumission.')
    }
}

const goBack = () => {
    router.push({ path: '/admin', query: { section: section.value } })
}

const changeSection = (newSection) => {
    router.push({ path: '/admin', query: { section: newSection } })
}
</script>

<style scoped>
.mb-3 {
    margin-bottom: 1rem;
}
</style>