<template>
  <div class="container">
    <h2 class="titulo">Gestión de Permisos de Salida</h2>

    <!-- 🔹 Filtros -->
    <div class="filtros">
      <input type="text" v-model="filtroNombre" placeholder="Buscar por nombre" />
      <input type="text" v-model="filtroApellido" placeholder="Buscar por apellido" />

      <select v-model="filtroEstado" required>
        <option value="" disabled selected>Estado</option>
        <option value="">Todos</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
      </select>

      <button @click="cargarPermisos" class="btn-search">Buscar</button>
      <button v-if="esAdmin()" @click="abrirFormulario()" class="btn-add">+ Añadir</button>
    </div>

    <!-- 🔹 Tabla -->
    <div class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th >ID</th>
            <th>Computador</th>
            <th>Trabajador</th>
            <th>Estado</th>
            <th>Detalles</th>
            <th v-if="esAdmin()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in permisos" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.computador?.nombre || p.codigo_computador }}</td>
            <td>{{ p.trabajador?.nombre }} {{ p.trabajador?.apellidos }}</td>
            <td>
              <span :class="['estado', p.estado]">{{ capitalize(p.estado) }}</span>
            </td>
            <td>
              <button class="btn-info" @click="verDetallesComputador(p.codigo_computador)">Computador</button>
              <button class="btn-info" @click="verDetallesTrabajador(p.cedula_trabajador)">Trabajador</button>
            </td>
            <td v-if="esAdmin()">
              <button @click="abrirFormulario(p)" class="btn-edit">Editar</button>
              <button @click="eliminarPermiso(p.id)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 🔹 Modal Form -->
    <div v-if="mostrarFormulario && esAdmin()" class="modal-overlay">
      <div class="modal">
        <h3>{{ modoEdicion ? "Editar" : "Añadir" }} Permiso</h3>
        <form @submit.prevent="guardarPermiso">
          <select v-model="form.codigo_computador" required>
            <option value="">Selecciona un computador</option>
            <option v-for="c in computadores" :key="c.codigo" :value="c.codigo">
              {{ c.nombre }} ({{ c.codigo }})
            </option>
          </select>
          <select v-model="form.cedula_trabajador" required>
            <option value="">Selecciona un trabajador</option>
            <option v-for="t in trabajadores" :key="t.cedula" :value="t.cedula">
              {{ t.nombre }} {{ t.apellidos }}
            </option>
          </select>
          <select v-model="form.estado" required>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <div class="modal-buttons">
            <button type="submit" class="btn save" :disabled="loading">
              {{ loading ? "Guardando..." : "Guardar" }}
            </button>
            <button type="button" class="btn cancel" @click="cerrarFormulario">Cancelar</button>
          </div>
        </form>
      </div>
    </div>

<!-- 🔹 Modal Detalles Computador -->
<div v-if="mostrarDetalleComputador" class="modal-overlay">
  <div class="modal">
    <h3>Detalles Computador</h3>
    <p><b>Nombre:</b> {{ detalleComputador?.nombre }}</p>
    <p><b>Marca:</b> {{ detalleComputador?.marca }}</p>
    <hr />
    <h4>Información Técnica:</h4>
    <p><b>Procesador:</b> {{ detalleExtra?.procesador }}</p>
    <p><b>RAM:</b> {{ detalleExtra?.ram }}</p>
    <p><b>Almacenamiento:</b> {{ detalleExtra?.almacenamiento }}</p>
    <p><b>Sistema Operativo:</b> {{ detalleExtra?.sistema_operativo }}</p>
    <p><b>Serial:</b> {{ detalleExtra?.serial }}</p>
    <p><b>Observaciones:</b> {{ detalleExtra?.observaciones || 'N/A' }}</p>
    <button class="btn cancel" @click="cerrarDetalleComputador">Cerrar</button>
  </div>
</div>

    <!-- 🔹 Modal Detalles Trabajador -->
    <div v-if="mostrarDetalleTrabajador" class="modal-overlay">
      <div class="modal">
        <h3>Detalles Trabajador</h3>
        <p><b>Nombre:</b> {{ detalleTrabajador?.nombre }} {{ detalleTrabajador?.apellidos }}</p>
        <p><b>Cargo:</b> {{ detalleTrabajador?.cargo }}</p>
        <p><b>Área:</b> {{ detalleTrabajador?.area_de_trabajo }}</p>
        <p><b>Teléfono:</b> {{ detalleTrabajador?.telefono }}</p>
        <p><b>Correo:</b> {{ detalleTrabajador?.correo }}</p>
        <button class="btn cancel" @click="cerrarDetalleTrabajador">Cerrar</button>
      </div>
    </div>

    <div v-if="mensaje" class="toast">{{ mensaje }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      permisos: [],
      computadores: [],
      trabajadores: [],
      filtroEstado: "",
      filtroNombre: "",
      filtroApellido: "",
      mostrarFormulario: false,
      modoEdicion: false,
      mensaje: "",
      loading: false,
      mostrarDetalleComputador: false,
      mostrarDetalleTrabajador: false,
      detalleComputador: null,
      detalleExtra: null,
      detalleTrabajador: null,
      form: {
        codigo_computador: "",
        cedula_trabajador: "",
        estado: "activo",
      },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    };
  },
  mounted() {
    this.cargarPermisos();
    this.cargarComputadores();
    this.cargarTrabajadores();
  },
  methods: {
    esAdmin() {
      return this.usuario && this.usuario.rol === "admin";
    },
    capitalize(text) {
      return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    },
    async cargarPermisos() {
      try {
        const params = {};
        if (this.filtroEstado) params.estado = this.filtroEstado;
        if (this.filtroNombre) params.nombre = this.filtroNombre;
        if (this.filtroApellido) params.apellido = this.filtroApellido;

        const res = await axios.get("http://192.168.1.233:8000/permisos/", { params });
        this.permisos = res.data;
      } catch (error) {
        console.error("Error al cargar permisos:", error);
      }
    },
    async cargarComputadores() {
      const res = await axios.get("http://192.168.1.233:8000/computadores/");
      this.computadores = res.data;
    },
    async cargarTrabajadores() {
      const res = await axios.get("http://192.168.1.233:8000/trabajadores/");
      this.trabajadores = res.data;
    },
    abrirFormulario(permiso = null) {
      this.mostrarFormulario = true;
      this.modoEdicion = !!permiso;
      this.form = permiso
        ? { ...permiso }
        : { codigo_computador: "", cedula_trabajador: "", estado: "activo" };
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardarPermiso() {
      this.loading = true;
      try {
        if (this.modoEdicion) {
          await axios.put(`http://192.168.1.233:8000/permisos/${this.form.id}`, this.form);
          this.mostrarToast("✅ Permiso actualizado correctamente");
        } else {
          await axios.post("http://192.168.1.233:8000/permisos/", this.form);
          this.mostrarToast("✅ Permiso añadido correctamente");
        }
        this.cargarPermisos();
        this.cerrarFormulario();
      } catch (error) {
        console.error("Error al guardar permiso:", error);
        this.mostrarToast("❌ Error al guardar permiso");
      } finally {
        this.loading = false;
      }
    },
    async eliminarPermiso(id) {
      if (confirm("¿Seguro deseas eliminar este permiso?")) {
        await axios.delete(`http://192.168.1.233:8000/permisos/${id}`);
        this.mostrarToast("✅ Permiso eliminado correctamente");
        this.cargarPermisos();
      }
    },
    async verDetallesComputador(codigo) {
      try {
        const resComp = await axios.get(`http://192.168.1.233:8000/computadores/${codigo}`);
        this.detalleComputador = resComp.data;

        try {
          const resDet = await axios.get(`http://192.168.1.233:8000/detalles/${codigo}`);
          this.detalleExtra = resDet.data;
        } catch (err) {
          this.detalleExtra = null;
        }

        this.mostrarDetalleComputador = true;
      } catch (error) {
        console.error("Error al cargar detalles de computador:", error);
        this.mostrarToast("❌ No se pudieron cargar los detalles del computador");
      }
    },
    cerrarDetalleComputador() {
      this.mostrarDetalleComputador = false;
      this.detalleComputador = null;
      this.detalleExtra = null;
    },
    async verDetallesTrabajador(cedula) {
      try {
        const res = await axios.get(`http://192.168.1.233:8000/trabajadores/${cedula}`);
        this.detalleTrabajador = res.data;
        this.mostrarDetalleTrabajador = true;
      } catch (error) {
        console.error("Error al cargar detalles del trabajador:", error);
      }
    },
    cerrarDetalleTrabajador() {
      this.mostrarDetalleTrabajador = false;
    },
    mostrarToast(msg) {
      this.mensaje = msg;
      setTimeout(() => (this.mensaje = ""), 3000);
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: "Segoe UI", sans-serif;
}
.titulo {
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
.filtros {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 20px;
}
.btn-search,
.btn-add {
  padding: 10px 15px;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
  border: none;
  cursor: pointer;
}
.btn-search {
  background: #3498db;
  color: white;
}
.btn-add {
  background-color: #2ecc71;
  color: white;
}
.tabla-container {
  overflow-x: auto;
}
.tabla {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  table-layout: fixed;
}
.tabla th,
.tabla td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
}
.tabla th {
  background-color: #3498db;
  color: white;
}
.estado {
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
}
.estado.pendiente {
  background: #f39c12;
}
.estado.hecho {
  background: #2ecc71;
}
.btn-edit,
.btn-delete {
  padding: 6px 12px;
  border-radius: 6px;
  color: white;
  border: none;
  cursor: pointer;
  margin: 2px;
  width: 90%;
  white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
  overflow: hidden;     /* Oculta el texto que se sale (opcional) */
  text-overflow: ellipsis; /* Añade "..." si el texto no cabe */
}
.btn-edit {
  background: #f39c12;
}
.btn-delete {
  background: #e74c3c;
}
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
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 12px;
  width: 420px;
}
.modal select,
.modal input,
.modal textarea {
  width: 100%;
  padding: 10px;
  margin: 6px 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.save {
  background: #2ecc71;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.4);
}

.save:hover {
  background: #27ae60;
  box-shadow: 0 6px 12px rgba(39, 174, 96, 0.5);
  transform: translateY(-2px);
}

.cancel {
  background: #e74c3c;
  color: white;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(231, 76, 60, 0.4);
}

.cancel:hover {
  background: #c0392b;
  box-shadow: 0 6px 12px rgba(192, 57, 43, 0.5);
  transform: translateY(-2px);
}
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #2ecc71;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
#obser{
  width: 10%;
  word-wrap: break-word; /* ✅ Rompe palabras largas */
  overflow-wrap: break-word; /* ✅ Soporte extra */
  white-space: normal; /* ✅ Permitir salto de línea */
  text-align: left; /* ✅ Mejor legibilidad */
  
}
.btn-info {
  background: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  margin: 2px;
  width: 100%;
  white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
  overflow: hidden;     /* Oculta el texto que se sale (opcional) */
  text-overflow: ellipsis; /* Añade "..." si el texto no cabe */
}
.btn-info:hover {
  background: #2980b9;
}


.estado.activo {
  background: #2ecc71;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
}
.estado.inactivo {
  background: #e74c3c;
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: bold;
}

/* ✅ Estilos Responsivos */

@media (max-width: 1024px) {
  .filtros {
    width: 100%;
    
    gap: 8px;
    align-items: stretch;
  }

  .tabla th,
  .tabla td {
    padding: 10px;
    font-size: 14px;
  }

  .modal {
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }

  .titulo {
    font-size: 22px;
  }

  .filtros input,
  .filtros select,
  .btn-search,
  .btn-add {
    width: 100%;
    font-size: 14px;
  }

  .tabla th,
  .tabla td {
    font-size: 12px;
    padding: 8px;
  }

  .modal select,
  .modal input,
  .modal textarea {
    font-size: 14px;
  }

  .modal-buttons button {
    font-size: 14px;
    padding: 8px 12px;
  }
}

@media (max-width: 480px) {
  .titulo {
    font-size: 18px;
  }

  .tabla-container {
    overflow-x: auto;
  }

  .tabla th,
  .tabla td {
    font-size: 11px;
    padding: 6px;
  }

  .btn-search,
  .btn-add,
  .btn-edit,
  .btn-delete,
  .btn-info {
    font-size: 10px;
    padding: 6px 8px;
  }

  .modal {
    width: 95%;
    padding: 15px;
  }

  .save,
  .cancel {
    font-size: 14px;
    padding: 8px;
  }
  .btn-edit,
  .btn-delete {
  padding: 3px 4px;
  margin: 2px;
  

}
}




</style>
