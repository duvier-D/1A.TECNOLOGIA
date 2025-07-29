<script>
import axios from "axios";
import ComputadorForm from "./ComputadorForm.vue";
import DetalleForm from "./detalles.vue";

export default {
  name: "Computadores",
  components: { ComputadorForm, DetalleForm },
  data() {
    return {
      mostrarDetalles: false,
      codigoSeleccionado: null,
      computadores: [],
      busqueda: '', // 🔍 NUEVO
      mostrarFormulario: false,
      modoEdicion: false,
      computadorActual: { codigo: '', nombre: '', marca: '', usuario: '', foto: '' },
      usuario: JSON.parse(localStorage.getItem("usuario")) || null
    };
  },
  computed: {
  computadoresFiltrados() {
    if (!this.busqueda) return this.computadores;
    const filtro = this.busqueda.toLowerCase();

    return this.computadores.filter(comp => {
      const nombreEquipo = comp.nombre?.toLowerCase() || '';
      const marca = comp.marca?.toLowerCase() || '';
      const cedula = comp.trabajador_id?.toLowerCase() || '';
      const nombreTrabajador = comp.trabajador?.nombre?.toLowerCase() || '';
      const apellidosTrabajador = comp.trabajador?.apellidos?.toLowerCase() || '';
      const nombreCompleto = (comp.trabajador?.nombre + ' ' + comp.trabajador?.apellidos)?.toLowerCase() || '';
      

      return (
        nombreEquipo.includes(filtro) ||
        marca.includes(filtro) ||
        cedula.includes(filtro) ||
        nombreTrabajador.includes(filtro) ||
        apellidosTrabajador.includes(filtro) ||
        nombreCompleto.includes(filtro)
      );
    });
  }
},
  mounted() {
    this.cargarComputadores();
  },
  methods: {
    esAdmin() {
      return this.usuario && this.usuario.rol === "admin";
    },
    async cargarComputadores() {
      try {
        const res = await axios.get("http://192.168.1.233:8000/computadores/");
        this.computadores = res.data;
      } catch (error) {
        console.error("Error al cargar los computadores:", error);
      }
    },
    abrirFormulario(computador = null) {
      if (!this.esAdmin()) return;
      console.log("Abriendo formulario", computador);
      this.mostrarFormulario = true;
      this.modoEdicion = !!computador;
      this.computadorActual = computador
        ? { ...computador }
        : { codigo: '', nombre: '', marca: '', usuario: '', foto: '' };
    },
    cerrarFormulario() {
      this.mostrarFormulario = false;
    },
    async guardarComputador(data) {
      try {
        if (this.modoEdicion) {
          await axios.put(`http://192.168.1.233:8000/computadores/${data.codigo}`, data);
        } else {
          await axios.post("http://192.168.1.233:8000/computadores/", data);
        }
        this.cargarComputadores();
        this.cerrarFormulario();
      } catch (error) {
        console.error("Error al guardar el computador:", error);
      }
    },
    async eliminarComputador(codigo) {
      if (!this.esAdmin()) return;
      if (confirm("¿Estás seguro de eliminar este computador?")) {
        try {
          await axios.delete(`http://192.168.1.233:8000/computadores/${codigo}`);
          this.cargarComputadores();
        } catch (error) {
          console.error("Error al eliminar:", error);
        }
      }
    },
    abrirDetalles(codigo) {
      this.codigoSeleccionado = codigo;
      this.mostrarDetalles = true;
    },
    cerrarDetalles() {
      this.mostrarDetalles = false;
      this.codigoSeleccionado = null;
    }
  }
};
</script>

<template>
  <div class="contodo">
    <!-- 🔍 Buscador -->
    <div class="buscador-container">
      <input
        v-model="busqueda"
        type="text"
        placeholder="🔍 Buscar por nombre, marca, usuario o código..."
        class="buscador-input"
      />
    </div>

    <button v-if="esAdmin()" @click="abrirFormulario()" class="btn">Añadir</button>

    <div class="targeta">
      <template v-if="computadoresFiltrados.length > 0">
        <div
          v-for="computador in computadoresFiltrados"
          :key="computador.codigo"
          class="card bg-white shadow-lg rounded-2xl p-4 flex flex-col items-center"
        >
          <img
            :src="computador.foto"
            alt="Foto del equipo"
            class="w-32 h-32 object-cover rounded-xl mb-4"
          />
          <button id="detalles" @click="abrirDetalles(computador.codigo)">Detalles</button>
          <p><strong>Usuario:</strong>{{ computador.trabajador ? computador.trabajador.nombre : 'NO ASIGNADO AUN' }}</p>
          <p><strong>Equipo:</strong> {{ computador.nombre }}</p>
          <p><strong>Código:</strong> {{ computador.codigo }}</p>
          <p><strong>marca:</strong> {{ computador.marca }}</p>

          <div class="divboton" v-if="esAdmin()">
            <button class="boton" id="btnr" @click="eliminarComputador(computador.codigo)">eliminar</button>
            <button class="boton" id="btng" @click="abrirFormulario(computador)">editar</button>
          </div>
        </div>
      </template>

      <div
        v-else-if="computadores.length > 0"
        class="mensaje-vacio"
      >
        🧐 No se encontraron computadores que coincidan con tu búsqueda.
      </div>
    </div>

    <ComputadorForm
      v-if="mostrarFormulario && esAdmin()"
      :computador="computadorActual"
      :esEdicion="modoEdicion"
      @guardar="guardarComputador"
      @cerrar="cerrarFormulario"
    />

    <DetalleForm
      v-if="mostrarDetalles"
      :codigoComputador="codigoSeleccionado"
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
