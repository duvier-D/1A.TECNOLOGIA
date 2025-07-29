<script>
import axios from "axios";

export default {
  name: "DetalleTrabajador",
  props: {
    cedula: String,
    cerrar: Function,
    esAdmin: Boolean
  },
  data() {
    return {
      trabajador: null,
      cargando: true
    };
  },
  async mounted() {
    await this.cargarTrabajador();
  },
  methods: {
    async cargarTrabajador() {
      try {
        const res = await axios.get(`http://192.168.1.233:8000/trabajadores/`);
        this.trabajador = res.data.find(t => t.cedula === this.cedula);
      } catch (error) {
        console.error("Error al cargar el trabajador:", error);
      } finally {
        this.cargando = false;
      }
    },
    async guardarCambios() {
      try {
        await axios.put(`http://192.168.1.233:8000/trabajadores/${this.cedula}`, this.trabajador);
        alert("Cambios guardados.");
        this.cerrar();
      } catch (error) {
        alert("Error al guardar.");
        console.error(error);
      }
    },
    async eliminarTrabajador() {
      if (!confirm("¿Eliminar trabajador?")) return;
      try {
        await axios.delete(`http://192.168.1.233:8000/trabajadores/${this.cedula}`);
        alert("Trabajador eliminado.");
        this.cerrar();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  }
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h3 class="text-lg font-bold mb-4">Detalle del Trabajador</h3>

      <div v-if="cargando">Cargando...</div>
      <div v-else>
        <form @submit.prevent="guardarCambios">
          <label>Cédula:</label>
          <input v-model="trabajador.cedula" readonly />

          <label>Nombre:</label>
          <input v-model="trabajador.nombre" :readonly="!esAdmin" />

          <label>Apellidos:</label>
          <input v-model="trabajador.apellidos" :readonly="!esAdmin" />

          <label>Cargo:</label>
          <input v-model="trabajador.cargo" :readonly="!esAdmin" />

          <label>Área de trabajo:</label>
          <input v-model="trabajador.area_de_trabajo" :readonly="!esAdmin" />

          <label>Edad:</label>
          <input type="number" v-model="trabajador.edad" :readonly="!esAdmin" />

          <label>Residencia:</label>
          <input v-model="trabajador.residencia" :readonly="!esAdmin" />

          <label>Teléfono:</label>
          <input v-model="trabajador.telefono" :readonly="!esAdmin" />

          <label>Correo:</label>
          <input v-model="trabajador.correo" :readonly="!esAdmin" />

          <div class="modal-buttons">
            <button v-if="esAdmin" type="submit">Guardar</button>
            <button v-if="esAdmin" type="button" @click="eliminarTrabajador">Eliminar</button>
            <button type="button" @click="cerrar">Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
label {
  display: block;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 0.25rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  background-color: #3498db;
  color: white;
}
button:last-child {
  background-color: #e74c3c;
}
</style>
