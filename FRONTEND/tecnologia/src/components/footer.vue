<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Gestión Tecnología</h3>
        <p>Sistema de gestión de equipos computacionales.</p>
      </div>

      <div class="footer-section">
        <h4>Contacto</h4>
        <p>Email: tecnologia@aseo1a.com.co</p>
        <p>Tel: 313 442 55 07</p>
      </div>

      <div class="footer-section">
        <h4>Redes</h4>
        <div class="social-icons">
          <a href="#" target="_blank">🌐</a>
          <a href="#" target="_blank">📘</a>
          <a href="#" target="_blank">🐦</a>
        </div>
      </div>
    
    </div>


    <!-- ⭐ Sección exclusiva para el creador -->
    <div class="creador-destacado">
      <p>👑 Desarrollado con orgullo por <span class="nombre-creador">Duvier Duarte Cabanzo</span></p>
    </div>

    <div class="footer-bottom">
      &copy; {{ new Date().getFullYear() }} 1A. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>

</script>

<style scoped>
.footer {
  background: linear-gradient(to right, #2c3e50, #34495e);
  color: white;
  padding: 2rem 1rem 1rem;
  margin-top: 50px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  max-width: 1200px;
  margin: auto;
}

.footer-section {
  flex: 1 1 200px;
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: 0.5rem;
  color: #f1c40f;
}

.footer-section p {
  margin: 0.2rem 0;
}

.social-icons a {
  color: white;
  font-size: 1.2rem;
  margin-right: 0.8rem;
  text-decoration: none;
}

.social-icons a:hover {
  color: #f1c40f;
}

.creador-destacado {
  background-color: #111;
  padding: 1rem;
  text-align: center;
  margin-top: 2rem;
  border-top: 2px solid #f1c40f;
  font-style: italic;
  font-size: 1rem;
}

.nombre-creador {
  color: #f1c40f;
  font-weight: bold;
  text-shadow: 1px 1px 4px black;
}

.footer-bottom {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1rem;
}
</style>
