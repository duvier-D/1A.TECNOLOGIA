<script setup>
import { useRouter } from 'vue-router'

import { ref } from 'vue'
import headerr from './components/header.vue'
import Login from './components/login.vue'




const router = useRouter()

// Obtener usuario del almacenamiento local
const usuario = ref(JSON.parse(localStorage.getItem("usuario")) || null)

// Manejar login exitoso
const onLoginSuccess = (user) => {
  localStorage.setItem("usuario", JSON.stringify(user))
  usuario.value = user
   router.push('/inicio')
}

// Cerrar sesión
const logout = () => {
  localStorage.removeItem("usuario")
  usuario.value = null
}
</script>

<template>
  <div class="superdiv">
    <!-- Encabezado -->
    <headerr v-if="usuario" :usuario="usuario" @logout="logout" />
    <router-view class="componente" v-if="usuario"></router-view>
    <
    
    

    <!-- Main -->
    <main>
      <!-- Mostrar login si no hay usuario logueado -->
      <Login v-if="!usuario" @login-success="onLoginSuccess" />

     
      
    </main>
  </div>

  
  
  
</template>

<style>
body {
  margin: 0;
  padding: 0;
 
}



main {
  display: flex;
  flex-direction: column;
  align-items: center;
}


</style>
