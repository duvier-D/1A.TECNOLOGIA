<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2 class="text-lg font-bold mb-4">
        {{ esEdicion ? 'Editar Trabajador' : 'Añadir Trabajador' }}
      </h2>

      <form @submit.prevent="enviarFormulario">
        <!-- Cedula -->
        <div class="form-group">
          <label>Cédula</label>
          <input type="text" v-model="form.cedula" :readonly="esEdicion" required />
        </div>

        <!-- Nombre -->
        <div class="form-group">
          <label>Nombre</label>
          <input type="text" v-model="form.nombre" required />
        </div>

        <!-- Apellidos -->
        <div class="form-group">
          <label>Apellidos</label>
          <input type="text" v-model="form.apellidos" required />
        </div>

        <!-- Cargo -->
        <div class="form-group">
          <label>Cargo</label>
          <input type="text" v-model="form.cargo" required />
        </div>

        <!-- Área de trabajo -->
        <div class="form-group">
          <label>Área de Trabajo</label>
          <input type="text" v-model="form.area_de_trabajo" required />
        </div>

        <!-- Edad -->
        <div class="form-group">
          <label>Edad</label>
          <input type="number" v-model="form.edad" required min="18" />
        </div>

        <!-- Residencia -->
        <div class="form-group">
          <label>Residencia</label>
          <input type="text" v-model="form.residencia" required />
        </div>

        <!-- Teléfono -->
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" v-model="form.telefono" required />
        </div>

        <!-- Correo -->
        <div class="form-group">
          <label>Correo</label>
          <input type="email" v-model="form.correo" required />
        </div>

        <!-- Foto -->
        <div class="form-group">
          <label>Foto</label>
          <input type="file" @change="subirImagen" accept="image/*" />
          <img v-if="form.foto" :src="form.foto" alt="Previsualización" class="preview-img" />
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
    trabajador: Object,
    esEdicion: Boolean,
  },
  data() {
    return {
      form: { ...this.trabajador },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null
    };
  },
  mounted() {
    if (!this.usuario || this.usuario.rol !== 'admin') {
      this.$emit('cerrar');
    }
  },
  methods: {
    async subirImagen(e) {
      const archivo = e.target.files[0];
      if (!archivo) return;

      const formData = new FormData();
      formData.append("foto", archivo);

      try {
        const res = await fetch("http://192.168.1.233:8000/trabajadores/upload-foto/", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        this.form.foto = data.foto_url;
      } catch (error) {
        console.error("Error al subir la imagen:", error);
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
  width: 450px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-height: 90vh;
  overflow-y: auto;
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

.preview-img {
  margin-top: 10px;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ddd;
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
