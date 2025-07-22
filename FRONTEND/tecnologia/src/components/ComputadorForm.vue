<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2 class="text-lg font-bold mb-4">
        {{ esEdicion ? 'Editar Computador' : 'Añadir Computador' }}
      </h2>

      <form @submit.prevent="enviarFormulario">
        <div class="form-group">
          <label>Código</label>
          <input type="text" v-model="form.codigo" :readonly="esEdicion" required />
        </div>

        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="form.nombre" required />
        </div>

        <div class="form-group">
          <label>Marca</label>
          <input type="text" v-model="form.marca" required />
        </div>

        <div class="form-group">
         <label>Asignar a Trabajador</label>
          <select v-model="form.trabajador_id">
           <option :value="null">-- NO ASIGNADO --</option>
           <option v-for="t in trabajadores" :key="t.cedula" :value="t.cedula">
          {{ t.nombre }} ({{ t.cedula }})
           </option>
          </select>
        </div>



        <div class="form-group">
          <label>Foto</label>
          <input type="file" @change="subirImagen" accept="image/*" />
        </div>

        <div class="modal-buttons">
          <button type="submit" class="btn save">Guardar</button>
          <button type="button" class="btn cancel" @click="$emit('cerrar')">Cancelar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    computador: Object,
    esEdicion: Boolean,
  },
  data() {
    return {
      form: { ...this.computador },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null,
      trabajadores: []
    };
  },
  
  mounted() {
    // Si no es admin, cerrar el formulario inmediatamente
    if (!this.usuario || this.usuario.rol !== 'admin') {
      this.$emit('cerrar');
    }
    this.cargarTrabajadores();
  },
  methods: {
    async subirImagen(e) {
      const archivo = e.target.files[0];
      if (!archivo) return;

      const formData = new FormData();
      formData.append("foto", archivo);

      try {
        const res = await fetch("http://192.168.1.233:8000/upload-foto/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.form.foto = data.foto_url;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    },
     async cargarTrabajadores() {
    try {
      const res = await fetch("http://192.168.1.233:8000/trabajadores/");
      const data = await res.json();
      this.trabajadores = data;
    } catch (error) {
      console.error("Error al cargar trabajadores:", error);
    }
  },

    enviarFormulario() {
      this.$emit("guardar", this.form);
    }
  }
};
</script>

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

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.save {
  background-color: #2ecc71;
  color: white;
}

.cancel {
  background-color: #e74c3c;
  color: white;
}
</style>
