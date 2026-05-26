import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './main.css'
import App from './App.vue'

// Import เลเยอร์ Views
import OperatorScreen from '@/views/OperatorScreen.vue'
import PatientScreen from '@/views/PatientScreen.vue'
import DashboardScreen from '@/views/DashboardScreen.vue'
import SummaryScreen from '@/views/SummaryScreen.vue'

// ตั้งค่า Router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'operator', component: OperatorScreen },
    { path: '/patient', name: 'patient', component: PatientScreen },
    { path: '/dashboard', name: 'dashboard', component: DashboardScreen },
    { path: '/summary', name: 'summary', component: SummaryScreen },
  ],
})

// เริ่มต้น Vue App
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
