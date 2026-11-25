import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("streamflix_user") || "null"),
    token: localStorage.getItem("streamflix_token") || null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    myList: (state) => (state.user ? state.user.myList || [] : []),
  },
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/users/signin", credentials);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem("streamflix_token", token);
        localStorage.setItem("streamflix_user", JSON.stringify(user));

        // Obtener perfil completo y actualizar lista
        await this.fetchProfile();
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Error al iniciar sesión";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post("/users/signup", userData);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem("streamflix_token", token);
        localStorage.setItem("streamflix_user", JSON.stringify(user));

        await this.fetchProfile();
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Error al registrar usuario";
        return false;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      if (!this.token) return;
      try {
        const response = await api.get("/users/profile");
        this.user = response.data;
        localStorage.setItem("streamflix_user", JSON.stringify(this.user));
      } catch (err) {
        if (err.response?.status === 401) {
          this.logout();
        }
      }
    },

    async addToMyList(movieId) {
      if (!this.isAuthenticated) return false;
      try {
        const response = await api.post(`/users/mylist/${movieId}`);
        if (this.user) {
          this.user.myList = response.data;
          localStorage.setItem("streamflix_user", JSON.stringify(this.user));
        }
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Error al agregar a Mi Lista";
        return false;
      }
    },

    async removeFromMyList(movieId) {
      if (!this.isAuthenticated) return false;
      try {
        const response = await api.delete(`/users/mylist/${movieId}`);
        if (this.user) {
          this.user.myList = response.data;
          localStorage.setItem("streamflix_user", JSON.stringify(this.user));
        }
        return true;
      } catch (err) {
        this.error = err.response?.data?.message || "Error al eliminar de Mi Lista";
        return false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem("streamflix_token");
      localStorage.removeItem("streamflix_user");
    },
  },
});
