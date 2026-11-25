<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="brand-logo">
          STREAM<span>FLIX</span>
        </router-link>
        <ul class="nav-links" :class="{ 'open': menuOpen }">
          <li>
            <router-link to="/" @click="menuOpen = false">Inicio</router-link>
          </li>
          <li v-if="authStore.isAuthenticated">
            <router-link to="/my-list" @click="menuOpen = false">Mi Lista</router-link>
          </li>
        </ul>
      </div>

      <div class="navbar-right">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Buscar títulos..."
            aria-label="Buscar películas"
          />
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        <div v-if="authStore.isAuthenticated" class="user-menu">
          <img
            :src="authStore.user?.avatarUrl || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'"
            alt="Avatar de usuario"
            class="user-avatar"
          />
          <span class="user-name">{{ authStore.user?.name }}</span>
          <button @click="logout" class="btn-logout" title="Cerrar sesión">
            Cerrar sesión
          </button>
        </div>

        <div v-else class="auth-buttons">
          <router-link to="/login" class="btn-login">Iniciar Sesión</router-link>
          <router-link to="/register" class="btn-register">Registrarse</router-link>
        </div>

        <button class="mobile-toggle" @click="menuOpen = !menuOpen">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useMovieStore } from "../stores/movieStore";

const authStore = useAuthStore();
const movieStore = useMovieStore();
const router = useRouter();

const isScrolled = ref(false);
const menuOpen = ref(false);
const searchQuery = ref("");

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const handleSearch = () => {
  movieStore.searchMovies(searchQuery.value);
  if (router.currentRoute.value.path !== "/") {
    router.push("/");
  }
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  z-index: 1000;
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
}

.navbar.scrolled {
  background-color: #141414;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.7);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.brand-logo {
  font-size: 1.8rem;
  font-weight: 800;
  color: #e50914;
  text-decoration: none;
  letter-spacing: 1px;
}

.brand-logo span {
  color: #ffffff;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 1.5rem;
}

.nav-links a {
  color: #e5e5e5;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #ffffff;
  font-weight: 700;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box input {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 0.4rem 0.8rem 0.4rem 2.2rem;
  border-radius: 4px;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.3s, width 0.3s;
  width: 180px;
}

.search-box input:focus {
  border-color: #e50914;
  width: 230px;
}

.search-icon {
  position: absolute;
  left: 0.6rem;
  width: 16px;
  height: 16px;
  color: #aaa;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

.user-name {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
}

.btn-logout {
  background: #e50914;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-logout:hover {
  background: #b81d24;
}

.auth-buttons {
  display: flex;
  gap: 0.8rem;
}

.btn-login {
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
}

.btn-register {
  background: #e50914;
  color: #fff;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: 600;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.mobile-toggle .bar {
  width: 24px;
  height: 2px;
  background-color: #fff;
}

@media (max-width: 768px) {
  .mobile-toggle {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: #141414;
    flex-direction: column;
    padding: 1rem 2rem;
    display: none;
  }

  .nav-links.open {
    display: flex;
  }

  .user-name {
    display: none;
  }

  .search-box input {
    width: 130px;
  }

  .search-box input:focus {
    width: 160px;
  }
}
</style>
