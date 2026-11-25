<template>
  <div class="movie-detail-container" v-if="movie">
    <div
      class="detail-hero"
      :style="{ backgroundImage: `url(${movie.bannerImg || movie.coverImg})` }"
    >
      <div class="detail-hero-overlay"></div>
      <div class="detail-content">
        <div class="poster-box">
          <img :src="movie.coverImg" :alt="movie.title" class="poster-img" />
        </div>

        <div class="info-box">
          <h1 class="movie-title">{{ movie.title }}</h1>

          <div class="meta-row">
            <span class="meta-item year">{{ movie.releaseYear }}</span>
            <span class="meta-item duration">{{ movie.duration }} min</span>
            <span class="meta-item category" v-if="movie.category">{{ getCategoryName(movie.category) }}</span>
          </div>

          <p class="description">{{ movie.description }}</p>

          <div class="actions">
            <button class="btn btn-primary" @click="isPlaying = true">
              ▶ Reproducir Película
            </button>
            <button
              v-if="authStore.isAuthenticated"
              class="btn btn-secondary"
              @click="toggleMyList"
            >
              {{ isInMyList ? "✓ En Mi Lista" : "+ Agregar a Mi Lista" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Video Player Integrado -->
    <div class="video-section" v-if="isPlaying">
      <div class="video-header">
        <h2>Reproduciendo: {{ movie.title }}</h2>
        <button class="close-video" @click="isPlaying = false">Cerrar Reproductor &times;</button>
      </div>
      <div class="video-container">
        <video v-if="movie.videoUrl" controls autoplay class="video-element">
          <source :src="movie.videoUrl" type="video/mp4" />
          Tu navegador no soporta reproducción de HTML5 video.
        </video>
        <div v-else class="no-video-alert">
          <p>El enlace de video para esta película no se encuentra disponible actualmente.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "../stores/authStore";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const authStore = useAuthStore();
const isPlaying = ref(false);

const getCategoryName = (category) => {
  if (typeof category === "object" && category !== null) {
    return category.name;
  }
  return category;
};

const isInMyList = computed(() => {
  return authStore.myList.some(
    (m) => (typeof m === "object" ? m._id === props.movie._id : m === props.movie._id)
  );
});

const toggleMyList = () => {
  if (isInMyList.value) {
    authStore.removeFromMyList(props.movie._id);
  } else {
    authStore.addToMyList(props.movie._id);
  }
};
</script>

<style scoped>
.movie-detail-container {
  color: #fff;
  min-height: 85vh;
}

.detail-hero {
  position: relative;
  min-height: 70vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  padding: 6rem 4rem 4rem 4rem;
}

.detail-hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(20, 20, 20, 0.95) 0%,
    rgba(20, 20, 20, 0.8) 50%,
    rgba(20, 20, 20, 0.4) 100%
  );
}

.detail-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 3rem;
  max-width: 1200px;
  align-items: center;
}

.poster-box {
  flex: 0 0 280px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
}

.poster-img {
  width: 100%;
  height: auto;
  display: block;
}

.info-box {
  flex: 1;
}

.movie-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.meta-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.meta-item.year {
  color: #46d369;
  font-weight: 700;
}

.meta-item.duration {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 8px;
  border-radius: 4px;
}

.meta-item.category {
  background: #e50914;
  padding: 2px 10px;
  border-radius: 4px;
  font-weight: 600;
}

.description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ddd;
  margin-bottom: 2rem;
  max-width: 750px;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.8rem 1.8rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn:hover {
  transform: scale(1.03);
}

.btn-primary {
  background: #e50914;
  color: #fff;
}

.btn-primary:hover {
  background: #b81d24;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.video-section {
  padding: 2rem 4rem;
  background: #111;
  border-top: 2px solid #222;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-video {
  background: #e50914;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
}

.video-container {
  max-width: 1000px;
  margin: 0 auto;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
}

.video-element {
  width: 100%;
  max-height: 600px;
  display: block;
}

.no-video-alert {
  padding: 3rem;
  text-align: center;
  color: #aaa;
}

@media (max-width: 768px) {
  .detail-hero {
    padding: 6rem 1.5rem 2rem 1.5rem;
  }
  .detail-content {
    flex-direction: column;
    text-align: center;
  }
  .poster-box {
    width: 180px;
  }
  .movie-title {
    font-size: 2rem;
  }
  .actions {
    justify-content: center;
  }
}
</style>
