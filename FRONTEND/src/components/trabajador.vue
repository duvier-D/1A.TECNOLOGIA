<script>
import axios from "axios";
import TrabajadorForm from "./trabajadorForn.vue";
import DetalleTrabajador from "./detalleTrabajador.vue";

export default {
  name: "Trabajadores",
  components: { TrabajadorForm, DetalleTrabajador },
  data() {
    return {
      mostrarDetalles: false,
      cedulaSeleccionada: null,
      trabajadores: [],
      busqueda: '',
      mostrarFormulario: false,
      modoEdicion: false,
      trabajadorActual: {
        cedula: '', nombre: '', apellidos: '', cargo: '',
        area_de_trabajo: '', edad: '', residencia: '',
        telefono: '', correo: '', foto: ''
      },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null
    };
  },
  computed: {
    trabajadoresFiltrados() {
      if (!this.busqueda) return this.trabajadores;
      const filtro = this.busqueda.toLowerCase();
      return this.trabajadores.filter(t =>
        t.nombre.toLowerCase().includes(filtro) ||
        t.apellidos.toLowerCase().includes(filtro) ||
        t.cargo.toLowerCase().includes(filtro) ||
        t.cedula.toLowerCase().includes(filtro)
      );
    }
  },
  mounted() {
    this.cargarTrabajadores();
  },
  methods: {
    esAdmin() {
      return this.usuario && this.usuario.rol === "admin";
    },
    async cargarTrabajadores() {
      try {
        const res = await axios.get("http://192.168.1.233:8000/trabajadores/");
        this.trabajadores = res.data;
      } catch (error) {
        console.error("Error al cargar los trabajadores:", error);
      }
    },
    abrirFormulario(trabajador = null) {
      if (!this.esAdmin()) return;
      this.mostrarFormulario = true;
      this.modoEdicion = !!trabajador;
      this.trabajadorActual = trabajador
        ? { ...trabajador }
        : { cedula: '', nombre: '', apellidos: '', cargo: '', area_de_trabajo: '', edad: '', residencia: '', telefono: '', correo: '', foto: '' };
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardarTrabajador(data) {
      try {
        if (this.modoEdicion) {
          await axios.put(`http://192.168.1.233:8000/trabajadores/${data.cedula}`, data);
        } else {
          await axios.post("http://192.168.1.233:8000/trabajadores/", data);
        }
        this.cargarTrabajadores();
        this.cerrarFormulario();
      } catch (error) {
        console.error("Error al guardar el trabajador:", error);
      }
    },
    async eliminarTrabajador(cedula) {
      if (!this.esAdmin()) return;
      if (confirm("¿Estás seguro de eliminar este trabajador?")) {
        try {
          await axios.delete(`http://192.168.1.233:8000/trabajadores/${cedula}`);
          this.cargarTrabajadores();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    },
    abrirDetalles(cedula) {
      this.cedulaSeleccionada = cedula;
      this.mostrarDetalles = true;
    },
    cerrarDetalles() {
      this.mostrarDetalles = false;
      this.cedulaSeleccionada = null;
    }
  }
};
</script>

<template>
  <div class="contodo">
    <div class="buscador-container">
      <input
        v-model="busqueda"
        type="text"
        placeholder="🔍 Buscar por nombre, apellido, cargo o cédula..."
        class="buscador-input"
      />
    </div>

    <button v-if="esAdmin()" @click="abrirFormulario()" class="btn">Añadir</button>

    <div class="targeta">
      <template v-if="trabajadoresFiltrados.length > 0">
        <div
          v-for="trabajador in trabajadoresFiltrados"
          :key="trabajador.cedula"
          class="card bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center"
        >
          <img
            :src="trabajador.foto"
            alt="Foto del trabajador"
            class="w-32 h-32 object-cover rounded-xl mb-4"
          />
          <button id="detalles" @click="abrirDetalles(trabajador.cedula)">Detalles</button>
          <p><strong>{{ trabajador.nombre }} {{ trabajador.apellidos }}</strong></p>
          <p><strong>Cargo:</strong> {{ trabajador.cargo }}</p>

          <div class="divboton" v-if="esAdmin()">
            <button class="boton" id="btnr" @click="eliminarTrabajador(trabajador.cedula)">eliminar</button>
            <button class="boton" id="btng" @click="abrirFormulario(trabajador)">editar</button>
          </div>
        </div>
      </template>

      <div v-else-if="trabajadores.length > 0" class="mensaje-vacio">
        🧐 No se encontraron trabajadores que coincidan con tu búsqueda.
      </div>
    </div>

    <TrabajadorForm
      v-if="mostrarFormulario && esAdmin()"
      :trabajador="trabajadorActual"
      :esEdicion="modoEdicion"
      @guardar="guardarTrabajador"
      @cerrar="cerrarFormulario"
    />

    <DetalleTrabajador
      v-if="mostrarDetalles"
      :cedula="cedulaSeleccionada"
      :cerrar="cerrarDetalles"
      :esAdmin="esAdmin()"
    />
  </div>
</template>

<style scoped>
/* 🔍 Estilos del buscador */
.buscador-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.buscador-input {
  width: 80%;
  max-width: 600px;
  padding: 12px 20px;
  border: 2px solid #3498db;
  border-radius: 25px;
  outline: none;
  font-size: 16px;
  transition: 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.buscador-input:focus {
  border-color: #2980b9;
  box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
}

.targeta {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.card {
  transition: transform 0.2s ease-in-out;
  width: 250px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
}
.card:hover {
  transform: scale(1.02);
}
img {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}
.divboton {
  display: flex;
  justify-content: space-around;
  width: 100%;
}
.boton {
  border-radius: 10px;
  height: 30px;
  width: 80px;
  color: black;
}
#btnr {
  background-color: #3498db;
}
#btng {
  background-color: #64f383;
}
.btn {
  background-color: #3498db;
  color: rgb(0, 0, 0);
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  position: fixed;
}
#btng:hover {
  background-color: rgb(248, 0, 0);
}
#btnr:hover {
  background-color: rgb(255, 0, 0);
}
#detalles {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  background-color: #3498db;
  color: black;
  font-weight: 600;
}
#detalles:hover {
  background-color: white;
}
.contodo {
  margin-top: 50px;
}

/* ✨ Estilo para mensaje de “no resultados” */
.mensaje-vacio {
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #555;
  padding: 20px;
  background-color: #f0f4f8;
  border: 2px dashed #3498db;
  border-radius: 12px;
  margin-top: 20px;
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
