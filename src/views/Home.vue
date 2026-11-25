<template>
  <div class="home-view">
    <!-- Hero Banner -->
    <HeroBanner v-if="heroMovie && !searchQuery" :movie="heroMovie" />

    <!-- Resultados de Búsqueda -->
    <div v-if="searchQuery" class="search-results-section">
      <h2 class="section-title">Resultados para: "{{ searchQuery }}"</h2>

      <div v-if="movieStore.loading" class="loading-state">
        <p>Buscando películas...</p>
      </div>

      <div v-else-if="filteredMovies.length > 0" class="movie-grid">
        <MovieCard
          v-for="movie in filteredMovies"
          :key="movie._id"
          :movie="movie"
        />
      </div>

      <div v-else class="no-results">
        <p>No encontramos películas que coincidan con tu búsqueda.</p>
      </div>
    </div>

    <!-- Carruseles por Categoría Dinámicos -->
    <div v-else class="categories-section">
      <div v-if="movieStore.loading && movieStore.movies.length === 0" class="loading-state">
        <p>Cargando catálogo de películas...</p>
      </div>

      <template v-else>
        <!-- Carrusel Principal / Destacadas -->
        <MovieCarousel
          v-if="movieStore.movies.length > 0"
          title="Películas Destacadas"
          :movies="movieStore.movies"
        />

        <!-- Carruseles Dinámicos por Categoría (v-for dinámico obligatorio) -->
        <MovieCarousel
          v-for="cat in activeCategories"
          :key="cat._id || cat.name"
          :title="cat.name"
          :movies="moviesByCategory[cat.name] || []"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import HeroBanner from "../components/HeroBanner.vue";
import MovieCarousel from "../components/MovieCarousel.vue";
import MovieCard from "../components/MovieCard.vue";
import { useMovieStore } from "../stores/movieStore";
import { sampleCategories } from "../services/mockData";

const movieStore = useMovieStore();

const heroMovie = computed(() => movieStore.heroMovie);
const searchQuery = computed(() => movieStore.searchQuery);
const filteredMovies = computed(() => movieStore.filteredMovies);
const moviesByCategory = computed(() => movieStore.moviesByCategory);

const activeCategories = computed(() => {
  return movieStore.categories.length > 0 ? movieStore.categories : sampleCategories;
});

onMounted(async () => {
  await movieStore.fetchCategories();
  await movieStore.fetchMovies();
});
</script>

<style scoped>
.home-view {
  min-height: 80vh;
}

.search-results-section {
  padding: 6rem 4rem 2rem 4rem;
}

.section-title {
  color: #fff;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.loading-state,
.no-results {
  text-align: center;
  padding: 4rem;
  color: #aaa;
  font-size: 1.2rem;
}

.categories-section {
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .search-results-section {
    padding: 6rem 1.5rem 2rem 1.5rem;
  }
}
</style>
