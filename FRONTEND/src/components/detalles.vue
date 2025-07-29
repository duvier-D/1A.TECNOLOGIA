<script>
import axios from "axios";

export default {
  name: "DetalleForm",
  props: {
    codigoComputador: String,
    cerrar: Function,
    esAdmin: Boolean
  },
  data() {
    return {
      detalle: null,
      modoEdicion: false,
      cargando: true
    };
  },
  async mounted() {
    await this.cargarDetalle();
  },
  methods: {
    async cargarDetalle() {
      try {
        const res = await axios.get(`http://192.168.1.233:8000/computadores/${this.codigoComputador}/detalles`);
        this.detalle = res.data;
        this.modoEdicion = true;
      } catch (error) {
        this.detalle = {
          codigo_computador: this.codigoComputador,
          procesador: '',
          ram: '',
          almacenamiento: '',
          sistema_operativo: '',
          observaciones: '',
          serial: ''
        };
        this.modoEdicion = false;
      } finally {
        this.cargando = false;
      }
    },
    async guardarDetalle() {
      const url = this.modoEdicion
        ? `http://192.168.1.233:8000/computadores/${this.codigoComputador}/detalles`
        : `http://192.168.1.233:8000/detalles/`;
      const metodo = this.modoEdicion ? 'put' : 'post';

      try {
        await axios[metodo](url, this.detalle);
        alert("Detalle guardado exitosamente.");
        this.cerrar();
      } catch (error) {
        console.error("Error al guardar el detalle:", error);
        alert("Error al guardar el detalle.");
      }
    },
    async eliminarDetalle() {
      if (!confirm("¿Deseas eliminar el detalle?")) return;
      try {
        await axios.delete(`http://192.168.1.233:8000/computadores/${this.codigoComputador}/detalles`);
        alert("Detalle eliminado.");
        this.cerrar();
      } catch (error) {
        console.error("Error al eliminar el detalle:", error);
      }
    }
  }
};
</script>

<template>
 <div class="modal-overlay">
    <div class="modal">
      <h3 class="text-lg font-bold mb-4">Detalle del Computador</h3>

      <div v-if="cargando">Cargando...</div>
      <div v-else>
        <form @submit.prevent="guardarDetalle">
          <label>serial:</label>
          <input v-model="detalle.serial" :readonly="!esAdmin" required />

          <label>Procesador:</label>
          <input v-model="detalle.procesador" :readonly="!esAdmin" required />

          <label>RAM:</label>
          <input v-model="detalle.ram" :readonly="!esAdmin" required />

          <label>Almacenamiento:</label>
          <input v-model="detalle.almacenamiento" :readonly="!esAdmin" required />

          <label>Sistema Operativo:</label>
          <input v-model="detalle.sistema_operativo" :readonly="!esAdmin" required />

          <label>Observaciones:</label>
          <textarea v-model="detalle.observaciones" :readonly="!esAdmin"></textarea>

          <div class="modal-buttons">
            <button v-if="esAdmin" type="submit">
              {{ modoEdicion ? 'Actualizar' : 'Guardar' }}
            </button>
            <button v-if="esAdmin && modoEdicion" type="button" @click="eliminarDetalle">Eliminar</button>
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
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

label {
  display: block;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 0.25rem;
}

input,
textarea {
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

button[type="button"]:last-child {
  background-color: #e74c3c;
}
</style>

