<template>
  <div class="container">
    <h2 class="titulo">Gestión de Mantenimientos</h2>

    <!-- 🔹 Filtros -->
    <div class="filtros">
      <!-- Rango de fechas -->
      <input type="date" v-model="filtroFechaInicio" />
      <input type="date" v-model="filtroFechaFin" />

      <select v-model="filtroTipo" required>
        <option value="" disabled selected>buscar tipo</option>
        <option value="">Todos</option>
        <option value="preventivo">Preventivo</option>
        <option value="correctivo">Correctivo</option>
      </select>

      <select v-model="filtroEstado"  required>
        <option value="" disabled selected>buscar estado</option>
        <option value="">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="hecho">Hecho</option>
      </select>

      <button @click="cargarMantenimientos">Buscar</button>
      <button v-if="esAdmin()" @click="abrirFormulario()" class="btn-add">+ Añadir</button>
    </div>

    <!-- 🔹 Tabla -->
    <div class="tabla-container">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Computador</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Tipo</th>
            <th >Observaciones</th>
            <th>Estado</th>
            <th v-if="esAdmin()">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in mantenimientos" :key="m.id">
            <td data-label="ID">{{ m.id }}</td>
            <td data-label="Computador">{{ m.computador?.nombre || m.computador_id }}</td>
            <td data-label="Fecha">{{ formatearFecha(m.fecha) }}</td>
            <td data-label="Hora">{{ m.hora }}</td>
            <td data-label="Tipo">{{ m.tipo }}</td>
            <td data-label="Observaciones">{{ m.observaciones }}</td>
            <td data-label="Estado">
             <span :class="['estado', m.estado]">{{ m.estado }}</span>
            </td>
            <td v-if="esAdmin()">
              <button @click="abrirFormulario(m)" class="btn-edit">Editar</button>
              <button @click="eliminarMantenimiento(m.id)" class="btn-delete">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 🔹 Modal Form -->
    <div v-if="mostrarFormulario && esAdmin()" class="modal-overlay">
      <div class="modal">
        <h3>{{ modoEdicion ? "Editar" : "Añadir" }} Mantenimiento</h3>
        <form @submit.prevent="guardarMantenimiento">
          <select v-model="form.computador_id" required>
            <option value="">Selecciona un computador</option>
            <option v-for="c in computadores" :key="c.codigo" :value="c.codigo">
              {{ c.nombre }} ({{ c.codigo }})
            </option>
          </select>
          <input type="date" v-model="form.fecha" required />
          <input type="time" v-model="form.hora" required />
          
          <select v-model="form.tipo" required>
            <option value="" disabled selected>Selecciona el tipo</option>
            <option value="preventivo">Preventivo</option>
            <option value="correctivo">Correctivo</option>
          </select>
          <textarea v-model="form.observaciones" placeholder="Observaciones"></textarea>
          <select v-model="form.estado" required>
            <option value="pendiente">Pendiente</option>
            <option value="hecho">Hecho</option>
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

    <div v-if="mensaje" class="toast">{{ mensaje }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      mantenimientos: [],
      computadores: [],
      filtroFechaInicio: "",
      filtroFechaFin: "",
      filtroTipo: "",
      filtroEstado: "",
      mostrarFormulario: false,
      modoEdicion: false,
      mensaje: "",
      loading: false,
      form: {
        computador_id: "",
        fecha: "",
        hora: "",
        tipo: "",
        observaciones: "",
        estado: "pendiente",
      },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null,
    };
  },
  mounted() {
    this.cargarMantenimientos();
    this.cargarComputadores();
  },
  methods: {
    esAdmin() {
      return this.usuario && this.usuario.rol === "admin";
    },
    formatearFecha(fecha) {
      return new Date(fecha + "T00:00:00").toLocaleDateString("es-CO");
    },
    async cargarMantenimientos() {
      try {
        const params = {};
        if (this.filtroFechaInicio) params.fecha_inicio = this.filtroFechaInicio;
        if (this.filtroFechaFin) params.fecha_fin = this.filtroFechaFin;
        if (this.filtroTipo) params.tipo = this.filtroTipo;
        if (this.filtroEstado) params.estado = this.filtroEstado;

        const res = await axios.get("http://192.168.1.233:8000/mantenimientos/", { params });
        this.mantenimientos = res.data;
      } catch (error) {
        console.error("Error al cargar mantenimientos:", error);
      }
    },
    async cargarComputadores() {
      try {
        const res = await axios.get("http://192.168.1.233:8000/mantenimientos/computadores");
        this.computadores = res.data;
      } catch (error) {
        console.error("Error al cargar computadores:", error);
      }
    },
    abrirFormulario(mantenimiento = null) {
      this.mostrarFormulario = true;
      this.modoEdicion = !!mantenimiento;
      this.form = mantenimiento
        ? { ...mantenimiento }
        : { computador_id: "", fecha: "", hora: "", tipo: "", observaciones: "", estado: "pendiente" };
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardarMantenimiento() {
      this.loading = true;
      try {
        if (this.modoEdicion) {
          await axios.put(`http://192.168.1.233:8000/mantenimientos/${this.form.id}`, this.form);
          this.mostrarToast("✅ Mantenimiento actualizado correctamente");
        } else {
          await axios.post("http://192.168.1.233:8000/mantenimientos/", this.form);
          this.mostrarToast("✅ Mantenimiento añadido correctamente");
        }
        this.cargarMantenimientos();
        this.cerrarFormulario();
      } catch (error) {
        console.error("Error al guardar mantenimiento:", error);
        this.mostrarToast("❌ Error al guardar mantenimiento");
      } finally {
        this.loading = false;
      }
    },
    async eliminarMantenimiento(id) {
      if (confirm("¿Seguro deseas eliminar este mantenimiento?")) {
        try {
          await axios.delete(`http://192.168.1.233:8000/mantenimientos/${id}`);
          this.mostrarToast("✅ Mantenimiento eliminado correctamente");
          this.cargarMantenimientos();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    },
    mostrarToast(msg) {
      this.mensaje = msg;
      setTimeout(() => (this.mensaje = ""), 3000);
    },
  },
};
</script>

<style scoped>
/* 🔹 Diseño moderno */
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
  white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
  overflow: hidden;     /* Oculta el texto que se sale (opcional) */
  text-overflow: ellipsis; /* Añade "..." si el texto no cabe */
}
.estado {
  padding: 4px 4px;
  border-radius: 4px;
  color: white;
  white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
  overflow: hidden;     /* Oculta el texto que se sale (opcional) */
  text-overflow: ellipsis; /* Añade "..." si el texto no cabe */
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

@media (max-width: 500px) {
  /* 🔹 Título */
  .titulo {
    font-size: 20px;
    text-align: center;
    margin-bottom: 16px;
  }

  /* 🔹 Filtros en columna */
  

  .filtros input,
  .filtros select,
  .btn-search,
  .btn-add {
    width: 100%;
    font-size: 14px;
    padding: 10px;
  }

  /* 🔹 Tabla con scroll horizontal */
 

  .tabla {
    min-width: 600px;
    font-size: 13px;
  }

  .tabla th,
  .tabla td {
    padding: 8px;
    word-break: break-word;
  }

  .btn-edit,
  .btn-delete {
    font-size: 12px;
    padding: 5px 10px;
    white-space: nowrap; /* Evita que el texto se rompa en dos líneas */
    overflow: hidden;     /* Oculta el texto que se sale (opcional) */
    text-overflow: ellipsis; /* Añade "..." si el texto no cabe */
    
  }

  /* 🔹 Modal responsive */
  .modal {
    width: 90%;
    padding: 15px;
  }

  .modal h3 {
    font-size: 18px;
    text-align: center;
  }

  .modal select,
  .modal input,
  .modal textarea {
    font-size: 14px;
    padding: 8px;
  }

  .modal-buttons {
    flex-direction: column;
    gap: 10px;
    margin-top: 12px;
  }

  .save,
  .cancel {
    width: 100%;
    font-size: 14px;
    padding: 10px;
  }

  /* 🔹 Toast adaptado */
  .toast {
    top: auto;
    bottom: 15px;
    left: 10px;
    right: 10px;
    font-size: 14px;
    padding: 10px;
    text-align: center;
  }

  /* 🔹 Observaciones columna: permitir que baje el texto */
  
}


</style>
