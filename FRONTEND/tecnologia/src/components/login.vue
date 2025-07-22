<template>
  <div class="login-container">
    <form @submit.prevent="iniciarSesion" class="login-form">
      <h2>Iniciar sesión</h2>

      <input
        v-model="form.usuario"
        type="text"
        placeholder="Usuario"
        required
      />
      <input
        v-model="form.contrasena"
        type="password"
        placeholder="Contraseña"
        required
      />
      <button type="submit">Ingresar</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const form = ref({
  usuario: "",
  contrasena: "",
});

const error = ref("");
const emit = defineEmits(["login-success"]);

const iniciarSesion = async () => {
  error.value = "";
  try {
    const res = await axios.post("http://192.168.1.233:8000/usuarios/login", {
      username: form.value.usuario,
      password: form.value.contrasena,
    });
    if (res.data && res.data.username) {
      emit("login-success", res.data);
    } else {
      error.value = "Credenciales inválidas";
    }
  } catch (err) {
    error.value = "Usuario o contraseña incorrectos";
    console.error("Error al iniciar sesión:", err);
  }
};
</script>

<style scoped>
.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.login-form {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.45);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.login-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.login-form button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.login-form h2 {
  text-align: center;
  color: #333;
}

.error {
  color: red;
  font-size: 0.9rem;
  text-align: center;
}
</style>