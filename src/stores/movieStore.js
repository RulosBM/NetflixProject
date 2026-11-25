import { defineStore } from "pinia";
import api from "../services/api";
import { sampleMovies, sampleCategories } from "../services/mockData";

export const useMovieStore = defineStore("movie", {
  state: () => ({
    movies: [],
    categories: [],
    selectedMovie: null,
    searchQuery: "",
    selectedCategory: "",
    loading: false,
    error: null,
  }),

  getters: {
    heroMovie: (state) => {
      if (state.movies.length > 0) return state.movies[0];
      return sampleMovies[0];
    },
    moviesByCategory: (state) => {
      const currentCategories = state.categories.length > 0 ? state.categories : sampleCategories;
      const currentMovies = state.movies.length > 0 ? state.movies : sampleMovies;
      const map = {};

      currentCategories.forEach((cat) => {
        map[cat.name] = currentMovies.filter((movie) => {
          if (!movie.category) return false;
          if (typeof movie.category === "object") {
            const idMatch = String(movie.category._id) === String(cat._id);
            const nameMatch =
              movie.category.name &&
              cat.name &&
              movie.category.name.trim().toLowerCase() === cat.name.trim().toLowerCase();
            return idMatch || nameMatch;
          }
          return String(movie.category) === String(cat._id);
        });
      });

      return map;
    },
    filteredMovies: (state) => {
      const source = state.movies.length > 0 ? state.movies : sampleMovies;
      return source.filter((movie) => {
        const matchesQuery = movie.title
          .toLowerCase()
          .includes(state.searchQuery.toLowerCase());
        const matchesCat = state.selectedCategory
          ? typeof movie.category === "object"
            ? String(movie.category._id) === String(state.selectedCategory) ||
              movie.category.name.toLowerCase() === state.selectedCategory.toLowerCase()
            : String(movie.category) === String(state.selectedCategory)
          : true;
        return matchesQuery && matchesCat;
      });
    },
  },

  actions: {
    async fetchMovies(params = {}) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get("/movies", { params });
        const data = response.data.movies || response.data;
        if (Array.isArray(data) && data.length > 0) {
          this.movies = data;
        } else {
          this.movies = sampleMovies;
        }
      } catch (err) {
        console.warn("API de películas no disponible, utilizando catálogo inicial.");
        this.movies = sampleMovies;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await api.get("/categories");
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.categories = response.data;
        } else {
          this.categories = sampleCategories;
        }
      } catch (err) {
        console.warn("API de categorías no disponible, utilizando categorías iniciales.");
        this.categories = sampleCategories;
      }
    },

    async fetchMovieById(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/movies/${id}`);
        this.selectedMovie = response.data;
        return response.data;
      } catch (err) {
        // Buscar en las películas actuales o en muestra
        const list = this.movies.length > 0 ? this.movies : sampleMovies;
        const found = list.find((m) => String(m._id) === String(id));
        if (found) {
          this.selectedMovie = found;
          return found;
        }
        this.error = "Película no encontrada";
        this.selectedMovie = null;
      } finally {
        this.loading = false;
      }
    },

    async searchMovies(title) {
      this.searchQuery = title;
      if (!title) {
        await this.fetchMovies();
        return;
      }
      try {
        const response = await api.get("/movies", { params: { title } });
        const data = response.data.movies || response.data;
        if (Array.isArray(data)) {
          this.movies = data;
        }
      } catch (err) {
        const source = this.movies.length > 0 ? this.movies : sampleMovies;
        this.movies = source.filter((m) =>
          m.title.toLowerCase().includes(title.toLowerCase())
        );
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },

    setSelectedCategory(catId) {
      this.selectedCategory = catId;
    },
  },
});
