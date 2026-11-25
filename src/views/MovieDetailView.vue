<template>
  <div class="movie-detail-view">
    <div v-if="movieStore.loading" class="loading-state">
      <p>Cargando información de la película...</p>
    </div>

    <div v-else-if="movieStore.error" class="error-state">
      <h2>{{ movieStore.error }}</h2>
      <router-link to="/" class="btn-back">Volver al Inicio</router-link>
    </div>

    <MovieDetail v-else-if="movie" :movie="movie" />
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import MovieDetail from "../components/MovieDetail.vue";
import { useMovieStore } from "../stores/movieStore";

const route = useRoute();
const movieStore = useMovieStore();

const movie = computed(() => movieStore.selectedMovie);

const loadMovie = async (id) => {
  if (id) {
    await movieStore.fetchMovieById(id);
  }
};

onMounted(() => {
  loadMovie(route.params.id);
});

watch(
  () => route.params.id,
  (newId) => {
    loadMovie(newId);
  }
);
</script>

<style scoped>
.movie-detail-view {
  min-height: 85vh;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 8rem 2rem 4rem 2rem;
  color: #fff;
}

.error-state h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: #e50914;
}

.btn-back {
  background: #e50914;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
}
</style>
