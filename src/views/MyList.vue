<template>
  <div class="my-list-view">
    <h1 class="page-title">Mi Lista</h1>

    <div v-if="authStore.loading" class="loading-state">
      <p>Cargando tu lista personalizada...</p>
    </div>

    <div v-else-if="myListMovies.length > 0" class="movie-grid">
      <MovieCard
        v-for="movie in myListMovies"
        :key="movie._id || movie"
        :movie="movie"
      />
    </div>

    <div v-else class="empty-list">
      <p>Aún no has agregado películas a tu lista.</p>
      <router-link to="/" class="btn-explore">Explorar Películas</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import MovieCard from "../components/MovieCard.vue";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();

const myListMovies = computed(() => authStore.myList);

onMounted(async () => {
  await authStore.fetchProfile();
});
</script>

<style scoped>
.my-list-view {
  min-height: 85vh;
  padding: 6rem 4rem 2rem 4rem;
}

.page-title {
  color: #fff;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 2rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.loading-state,
.empty-list {
  text-align: center;
  padding: 6rem 2rem;
  color: #aaa;
  font-size: 1.2rem;
}

.btn-explore {
  background: #e50914;
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 700;
  display: inline-block;
  margin-top: 1.5rem;
  transition: background-color 0.2s;
}

.btn-explore:hover {
  background: #b81d24;
}

@media (max-width: 768px) {
  .my-list-view {
    padding: 6rem 1.5rem 2rem 1.5rem;
  }
}
</style>
