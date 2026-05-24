import { createRouter, createWebHistory } from 'vue-router'
import OperatorScreen from '@/views/OperatorScreen.vue'
import PatientScreen from '@/views/PatientScreen.vue'
import DashboardScreen from '@/views/DashboardScreen.vue'
import SummaryScreen from '@/views/SummaryScreen.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'operator',
      component: OperatorScreen,
    },
    {
      path: '/patient',
      name: 'patient',
      component: PatientScreen,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardScreen,
    },
    {
      path: '/summary',
      name: 'summary',
      component: SummaryScreen,
    },
  ],
})

export default router
