<template>
  <header>
    <div class="header-container">
      <h1>Gestión Tecnología</h1>
      <div class="header-actions">
        <!-- ✅ Botón menú -->
        <button class="menu-toggle" @click="toggleMenu">
          {{ menuAbierto ? 'Cerrar Menú' : '☰ Menú' }}
        </button>
        <!-- ✅ Componente Perfil -->
        <perfil id="perfil" @logout="$emit('logout')" />
      </div>
    </div>

    <!-- ✅ Menú desplegable -->
    <nav v-if="menuAbierto" class="menu-desplegable" id="menu">
      <router-link class="btn" to="/inicio" @click="cerrarMenu">Inicio</router-link>
      <router-link class="btn" to="/computadores" @click="cerrarMenu">Computadores</router-link>
      <router-link class="btn" v-if="usuario?.rol === 'admin'" to="/usuarios" @click="cerrarMenu">Usuarios</router-link>
      <router-link class="btn" to="/trabajador" @click="cerrarMenu">Trabajadores</router-link>
      <router-link class="btn" to="/mantenimientos" @click="cerrarMenu">Mantenimientos</router-link>
      <router-link class="btn" to="/permisos" @click="cerrarMenu">Permisos</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import perfil from "./Perfil.vue";

const props = defineProps(["usuario"]);
const emit = defineEmits(["logout"]);

const menuAbierto = ref(false);

function toggleMenu() {
  menuAbierto.value = !menuAbierto.value;
}
function cerrarMenu() {
  menuAbierto.value = false;
}
</script>

<style scoped>
header {
  width: 100%;
  background: linear-gradient(to right, #64f383, #656de9);
  color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
}
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.header-container h1 {
  font-size: 20px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 40%;
  justify-content: center;
}
.menu-toggle {
  background: #2ecc71;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.menu-toggle:hover {
  background: #27ae60;
}
.menu-desplegable {
 
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background: white;
  padding: 15px;
  margin-top: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  animation: slideDown 0.3s ease;
}
.menu-desplegable .btn {
  text-decoration: none;
  color: #333;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  background: #f4f4f4;
  transition: background 0.3s ease;
}
.menu-desplegable .btn:hover {
  background: #3498db;
  color: white;
}
#menu{
  width: 85%;
}


/* ✅ Animación */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ✅ Responsive */
@media screen and (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: flex-start;
  }
  .header-actions {
    width: 100%;
    justify-content: space-around;
  }
 
  .menu-desplegable {
    width: 100%;
  }
}
#perfil{
  width: 30%;
}
</style>
