<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API_URL = "http://192.168.1.233:8000/asignar-usuario";

const usuarios = ref([]);
const trabajadores = ref([]);
const asignaciones = ref([]);
const loading = ref(false);

const selectedUsuario = ref("");
const selectedTrabajador = ref("");

// ✅ Cargar datos iniciales
onMounted(async () => {
  await cargarUsuarios();
  await cargarTrabajadores();
  await cargarAsignaciones();
});

const cargarUsuarios = async () => {
  const { data } = await axios.get("http://192.168.1.233:8000/usuarios/");
  usuarios.value = data;
};

const cargarTrabajadores = async () => {
  const { data } = await axios.get("http://192.168.1.233:8000/trabajadores/");
  trabajadores.value = data;
};

const cargarAsignaciones = async () => {
  const { data } = await axios.get(API_URL);
  asignaciones.value = data;
};

// ✅ Asignar usuario
const asignarUsuario = async () => {
  if (!selectedUsuario.value || !selectedTrabajador.value) {
    alert("Selecciona un usuario y un trabajador");
    return;
  }
  try {
    await axios.post(API_URL, {
      usuario_id: selectedUsuario.value,
      trabajador_id: selectedTrabajador.value,
    });
    await cargarAsignaciones();
    selectedUsuario.value = "";
    selectedTrabajador.value = "";
    alert("Asignación realizada con éxito");
  } catch (error) {
    console.error(error);
    alert("Error al asignar");
  }
};

// ✅ Eliminar asignación
const eliminarAsignacion = async (id) => {
  if (confirm("¿Seguro que quieres eliminar esta asignación?")) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await cargarAsignaciones();
    } catch (error) {
      console.error(error);
      alert("Error al eliminar");
    }
  }
};
</script>

<template>
  <div class="asignar-container">
    <h2 class="title">Asignar Usuario a Trabajador</h2>

    <!-- FORMULARIO -->
    <div class="form-container">
      <select v-model="selectedUsuario" class="select">
        <option value="">Seleccionar Usuario</option>
        <option v-for="u in usuarios" :key="u.username" :value="u.username">
          {{ u.username }} ({{ u.rol }})
        </option>
      </select>

      <select v-model="selectedTrabajador" class="select">
        <option value="">Seleccionar Trabajador</option>
        <option v-for="t in trabajadores" :key="t.cedula" :value="t.cedula">
          {{ t.nombre }} {{ t.apellidos }}
        </option>
      </select>

      <button @click="asignarUsuario" class="btn-assign">
        Asignar
      </button>
    </div>

    <!-- TABLA DE ASIGNACIONES -->
    <h3 class="subtitle">Asignaciones Actuales</h3>
    <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Trabajador</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in asignaciones" :key="a.id">
            <td>{{ a.id }}</td>
            <td>{{ a.usuario_id }}</td>
            <td>{{ a.trabajador_id }}</td>
            <td>
              <button @click="eliminarAsignacion(a.id)" class="btn-delete">
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="asignaciones.length === 0">
            <td colspan="4" class="empty-text">No hay asignaciones</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
/* Contenedor principal */
.asignar-container {
  max-width: 900px;
  margin: 40px auto;
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: "Segoe UI", Tahoma, sans-serif;
}

/* Títulos */
.title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.4rem;
  margin: 25px 0 10px;
  color: #444;
  font-weight: 600;
}

/* FORMULARIO */
.form-container {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.select {
  flex: 1;
  min-width: 180px;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.select:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 8px rgba(79, 70, 229, 0.4);
  outline: none;
}

.btn-assign {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-assign:hover {
  background: linear-gradient(135deg, #4338ca, #4f46e5);
  transform: scale(1.05);
}

/* TABLA */
.table-container {
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.styled-table thead {
  background: #4f46e5;
  color: #fff;
}

.styled-table th,
.styled-table td {
  text-align: left;
  padding: 14px;
}

.styled-table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.styled-table tbody tr:hover {
  background: #f9fafb;
}

/* Botón Eliminar */
.btn-delete {
  background: #ef4444;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.05);
}

/* Texto vacío */
.empty-text {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 15px;
}
</style>

