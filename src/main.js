import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/global.css'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'


import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
    faArrowLeft, faFloppyDisk, faXmark,
    faUser,
    faRightToBracket,
    faUserPlus,
    faBookOpen,
    faFaceSmile,
    faShieldHalved,
    faCircleUser,
    faBars,
    faPlus,
    faFileLines // ✅ ce nom est le nouveau nom de faFileAlt
} from '@fortawesome/free-solid-svg-icons'


// Ajoute les icônes à la bibliothèque
library.add(
    faArrowLeft, faFloppyDisk, faXmark,
    faUser,
    faRightToBracket,
    faUserPlus,
    faBookOpen,
    faFaceSmile,
    faShieldHalved,
    faCircleUser,
    faBars,
    faPlus,
    faFileLines // ✅ ici aussi
)


const app = createApp(App)
app.use(createPinia())
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(VCalendar, {})
app.use(router)
app.mount('#app')

import { useUserStore } from './stores/userStore'

const userStore = useUserStore()
userStore.loadUserFromToken()
window.userStore = userStore // ⬅️ pour test console

