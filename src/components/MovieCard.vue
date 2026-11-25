<template>
  <div class="movie-card" @click="goToDetail">
    <div class="card-image-wrapper">
      <img
        :src="movie.coverImg || 'https://via.placeholder.com/300x450/141414/ffffff?text=StreamFlix'"
        :alt="movie.title"
        class="card-image"
        loading="lazy"
      />
      <div class="card-overlay">
        <h4 class="card-title">{{ movie.title }}</h4>
        <div class="card-meta">
          <span class="card-year">{{ movie.releaseYear }}</span>
          <span class="card-duration">{{ movie.duration }}m</span>
          <span class="card-category" v-if="movie.category">{{ getCategoryName(movie.category) }}</span>
        </div>
        <p class="card-desc">{{ movie.description }}</p>
        
        <div class="card-actions">
          <button class="action-btn play-btn" title="Ver detalle" @click.stop="goToDetail">
            ▶
          </button>
          <button
            v-if="authStore.isAuthenticated"
            class="action-btn list-btn"
            :class="{ 'in-list': isInMyList }"
            :title="isInMyList ? 'Eliminar de Mi Lista' : 'Agregar a Mi Lista'"
            @click.stop="toggleMyList"
          >
            {{ isInMyList ? '✓' : '+' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const authStore = useAuthStore();

const getCategoryName = (category) => {
  if (typeof category === "object" && category !== null) {
    return category.name;
  }
  return category;
};

const isInMyList = computed(() => {
  return authStore.myList.some((m) => (typeof m === "object" ? m._id === props.movie._id : m === props.movie._id));
});

const goToDetail = () => {
  router.push(`/movies/${props.movie._id}`);
};

const toggleMyList = () => {
  if (isInMyList.value) {
    authStore.removeFromMyList(props.movie._id);
  } else {
    authStore.addToMyList(props.movie._id);
  }
};
</script>

<style scoped>
.movie-card {
  flex: 0 0 auto;
  width: 220px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  background-color: #1f1f1f;
}

.movie-card:hover {
  transform: scale(1.08) translateY(-5px);
  z-index: 10;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.8);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 140%; /* aspect ratio 1:1.4 */
}

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 100%);
  opacity: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  transition: opacity 0.3s ease;
}

.movie-card:hover .card-overlay {
  opacity: 1;
}

.card-title {
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  line-height: 1.2;
}

.card-meta {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-year {
  color: #46d369;
  font-weight: 700;
}

.card-duration {
  color: #ccc;
}

.card-category {
  background: #e50914;
  color: #fff;
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 0.65rem;
}

.card-desc {
  font-size: 0.75rem;
  color: #bbb;
  margin-bottom: 0.8rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.action-btn:hover {
  background: #fff;
  color: #000;
  border-color: #fff;
}

.action-btn.in-list {
  background: #e50914;
  border-color: #e50914;
}

@media (max-width: 768px) {
  .movie-card {
    width: 150px;
  }
}
</style>
