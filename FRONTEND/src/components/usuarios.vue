<template>
  <div>
    <h2>Gestión de Usuarios</h2>
    <form @submit.prevent="registrarUsuario">
      <input v-model="nuevo.username" placeholder="Usuario" required />
      <input v-model="nuevo.password" type="password" placeholder="Contraseña" required />
      <select v-model="nuevo.rol">
        <option value="admin">Admin</option>
        <option value="normal">Normal</option>
      </select>
      <button>Registrar</button>
      <router-link to="/asignarusuario" custom v-slot="{ navigate }">
       <button @click="navigate" class="btn-primario"> Asignar usuarios</button>
      </router-link>
    </form>

    <ul>
      <li v-for="u in usuarios" :key="u.username">
        {{ u.username }} ({{ u.rol }})
        <button @click="eliminarUsuario(u.username)">Eliminar</button>
      </li>
    </ul>
  </div>
  
</template>

<script>

import axios from 'axios'

export default {
  name: 'Usuarios',
  data() {
    return {
      usuarios: [],
      nuevo: { username: '', password: '', rol: 'normal' },
    }
  },
  mounted() {
    this.cargarUsuarios()
  },
  methods: {
    async cargarUsuarios() {
      const res = await axios.get('http://192.168.1.233:8000/usuarios/')
      this.usuarios = res.data
    },
    async registrarUsuario() {
      await axios.post('http://192.168.1.233:8000/usuarios/registrar', this.nuevo)
      this.cargarUsuarios()
    },
    async eliminarUsuario(username) {
      await axios.delete(`http://192.168.1.233:8000/usuarios/${username}`)
      this.cargarUsuarios()
    },
  },
}

</script>

<style scoped>
h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.8rem;
}

form {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

input,
select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 1rem;
  min-width: 180px;
}

button {
  padding: 10px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #2980b9;
}

ul {
  list-style: none;
  padding: 0;
  max-width: 500px;
  margin: auto;
}

li {
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 0.2s;
}

li:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

li button {
  background-color: #e74c3c;
  padding: 8px 12px;
  font-size: 0.9rem;
  border-radius: 6px;
}

li button:hover {
  background-color: #c0392b;
}
</style>
