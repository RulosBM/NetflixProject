<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-brand">
        <h3>STREAM<span>FLIX</span></h3>
        <p>Tu plataforma favorita de películas y series en alta definición.</p>
      </div>

      <div class="footer-links">
        <h4>Navegación</h4>
        <ul>
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/my-list">Mi Lista</router-link></li>
          <li><router-link to="/login">Iniciar Sesión</router-link></li>
          <li><router-link to="/register">Registro</router-link></li>
        </ul>
      </div>

      <div class="footer-social">
        <h4>Redes Sociales</h4>
        <div class="social-icons">
          <a href="#" aria-label="Facebook">Facebook</a>
          <a href="#" aria-label="Twitter">Twitter / X</a>
          <a href="#" aria-label="Instagram">Instagram</a>
          <a href="#" aria-label="YouTube">YouTube</a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2026 StreamFlix. Todos los derechos reservados. Proyecto educativo.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #0f0f0f;
  color: #808080;
  padding: 3rem 0 1.5rem 0;
  border-top: 1px solid #222;
  margin-top: 4rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
}

.footer-brand h3 {
  color: #e50914;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 0.8rem;
}

.footer-brand h3 span {
  color: #fff;
}

.footer-brand p {
  font-size: 0.9rem;
  line-height: 1.5;
}

.footer-links h4,
.footer-social h4 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #808080;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

.social-icons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.social-icons a {
  color: #808080;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.social-icons a:hover {
  color: #e50914;
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0 auto;
  padding-top: 1.5rem;
  border-top: 1px solid #1a1a1a;
  text-align: center;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
