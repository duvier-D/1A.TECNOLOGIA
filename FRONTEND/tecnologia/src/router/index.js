import { createRouter,createWebHistory } from "vue-router";
import computadores from '@/components/Computadores.vue';
import usuarios from '@/components/usuarios.vue';
import inicio from '@/components/inicio.vue';
import foter from '@/components/footer.vue';
import trabajador from '@/components/trabajador.vue';
import Asignarusuario from "@/components/Asignarusuario.vue";
import mantenimientos from "@/components/Mantenimientos.vue";
import permisos from "@/components/Permisos.vue";



const routes = [
    {path:'/computadores', component: computadores},
    {path:'/usuarios',component:usuarios},
    {path:'/inicio', component:inicio},
    {path:'/foter',component:foter},
    {path: '/trabajador', component:trabajador},
    {path:'/asignarusuario', component:Asignarusuario},
    {path: '/mantenimientos', component: mantenimientos},
    {path: '/permisos', component: permisos}
   
    
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;