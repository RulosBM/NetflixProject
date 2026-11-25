<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Crear Cuenta</h2>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input
            id="name"
            type="text"
            v-model="name"
            required
            placeholder="Juan"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            type="text"
            v-model="lastName"
            required
            placeholder="Pérez"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            type="email"
            v-model="email"
            required
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña (Mínimo 6 caracteres)</label>
          <input
            id="password"
            type="password"
            v-model="password"
            required
            minlength="6"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-submit" :disabled="authStore.loading">
          {{ authStore.loading ? "Registrando..." : "Registrarse" }}
        </button>
      </form>

      <div class="auth-footer">
        <p>
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicia sesión</router-link>.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const name = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");

const authStore = useAuthStore();
const router = useRouter();

const handleSubmit = async () => {
  const success = await authStore.register({
    name: name.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  });

  if (success) {
    router.push("/");
  }
};
</script>

<style scoped>
.auth-page {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1rem 2rem 1rem;
}

.auth-card {
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid #333;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 440px;
  border-radius: 8px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.8);
}

.auth-card h2 {
  color: #fff;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.error-message {
  background: rgba(225, 9, 20, 0.2);
  border: 1px solid #e50914;
  color: #ff6b6b;
  padding: 0.8rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.form-group label {
  color: #8c8c8c;
  font-size: 0.85rem;
}

.form-group input {
  background: #333;
  border: 1px solid transparent;
  border-radius: 4px;
  color: #fff;
  padding: 0.75rem;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: #e50914;
}

.btn-submit {
  background: #e50914;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 4px;
  padding: 0.9rem;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #b81d24;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  color: #737373;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #fff;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
