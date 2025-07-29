<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const emit = defineEmits(["logout"]); // ✅ Esto permitirá emitir el evento al padre

const perfil = ref({ nombre: "", foto: "", username: "" });
const loading = ref(true);

onMounted(async () => {
  const usuarioData = localStorage.getItem("usuario");
  if (usuarioData) {
    const usuarioObj = JSON.parse(usuarioData);
    const username = usuarioObj.username;

    try {
      const { data } = await axios.get(
        `http://192.168.1.233:8000/asignar-usuario/perfil/${username}`
      );
      perfil.value = data;
      perfil.value.username = username;
    } catch (error) {
      console.error("Error cargando perfil", error);
    } finally {
      loading.value = false;
    }
  }
});
</script>

<template>
  <div class="card">
    <div v-if="loading" class="loading">Cargando perfil...</div>
    <div v-else class="content">
      <img
        id="imagen"
        :src="perfil.foto || 'https://via.placeholder.com/150'"
        alt="Foto de perfil"
      />


      <div class="buttons">
        <!-- ✅ Aquí emitimos el evento -->
        <button class="btn" @click="emit('logout')">Cerrar sesión</button>
              <div>
        <h2>{{ perfil.nombre }}</h2>
        <p>@{{ perfil.username }}</p>
      </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.card {
  width: 100%;
  margin:2px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  padding: 5px;
  
}
.content{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    
}

.loading {
  padding: 10px;
  text-align: center;
  color: gray;
}

#imagen {
  width: 60px;
  height: 60px;
  border-radius: 50%; /* Foto circular */
  object-fit: cover; /* Ajusta la imagen sin deformarla */
  object-position: center;
  display: block;
  
}

h2 {
  font-size: 10px;
  margin-bottom: 0;
  color: black;
  
  
}

p {
  font-size: 14px;
  color: #666;
  margin-bottom: 1px;
  
}

.buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 100%;
  
}

.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 10px;
  transition: 0.3s;
  width: 90%;
  background-color:  #ef4444;
  height: 70%;
  color: #e5e7eb;
}





.logout {
  background-color: #e5e7eb;
  color: #374151;
}

.btn:hover {
  background-color: #fd0000;
}
</style>
