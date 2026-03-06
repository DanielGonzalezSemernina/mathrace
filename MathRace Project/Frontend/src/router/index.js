// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

import Login from '@/components/Login.vue'
import PaginaPrincipal from '@/components/PaginaPrincipal.vue'
import unJugador from '@/components/unJugador.vue'
import perfil from '@/components/PerfilUsuari.vue'
const routes = [
  {
    path: '/',
    component: Login,
    name: 'Login'
  },
  {
    path: '/benvingut',
    component: PaginaPrincipal,
    name: 'PaginaPrincipal'
  },
  {
    path: '/juga',
    component: unJugador,
  },
  {
    path: '/perfil',
    component: perfil,
  },
]


const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router
