<template>
  <div class="hero-banner" v-if="movie">
    <div
      class="hero-background"
      :style="{ backgroundImage: `url(${movie.bannerImg || movie.coverImg})` }"
    >
      <div class="hero-overlay"></div>
    </div>

    <div class="hero-content">
      <h1 class="hero-title">{{ movie.title }}</h1>
      <div class="hero-meta">
        <span class="meta-item year">{{ movie.releaseYear }}</span>
        <span class="meta-item duration">{{ movie.duration }} min</span>
        <span class="meta-item category" v-if="movie.category">{{ getCategoryName(movie.category) }}</span>
      </div>
      <p class="hero-description">{{ movie.description }}</p>

      <div class="hero-actions">
        <button class="btn btn-play" @click="playVideo">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          Reproducir
        </button>
        <router-link :to="`/movies/${movie._id}`" class="btn btn-info">
          <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          Más información
        </router-link>
      </div>
    </div>

    <!-- Video Modal Simulado -->
    <div v-if="showModal" class="video-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <video v-if="movie.videoUrl" controls autoplay class="video-player">
          <source :src="movie.videoUrl" type="video/mp4" />
          Tu navegador no soporta reproducción de video.
        </video>
        <div v-else class="no-video">
          <p>El trailer o video de esta película no está disponible temporalmente.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
});

const showModal = ref(false);

const getCategoryName = (category) => {
  if (typeof category === "object" && category !== null) {
    return category.name;
  }
  return category;
};

const playVideo = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
.hero-banner {
  position: relative;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  color: #fff;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center top;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(20, 20, 20, 0.95) 0%,
    rgba(20, 20, 20, 0.6) 50%,
    rgba(20, 20, 20, 0.1) 100%
  ),
  linear-gradient(
    0deg,
    #141414 0%,
    transparent 50%
  );
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
  padding: 0 4rem;
  margin-top: 4rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  line-height: 1.1;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.hero-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.2rem;
  font-size: 0.95rem;
}

.meta-item.year {
  color: #46d369;
  font-weight: 700;
}

.meta-item.duration {
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 2px 6px;
  border-radius: 3px;
}

.meta-item.category {
  background: rgba(229, 9, 20, 0.8);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
}

.hero-description {
  font-size: 1.05rem;
  line-height: 1.5;
  color: #e5e5e5;
  margin-bottom: 2rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.8rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.2s, background-color 0.2s;
}

.btn:hover {
  transform: scale(1.03);
}

.btn-play {
  background: #ffffff;
  color: #000000;
}

.btn-play:hover {
  background: rgba(255, 255, 255, 0.85);
}

.btn-info {
  background: rgba(109, 109, 110, 0.7);
  color: #ffffff;
}

.btn-info:hover {
  background: rgba(109, 109, 110, 0.4);
}

.icon {
  width: 20px;
  height: 20px;
}

/* Modal Styling */
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  position: relative;
  width: 90%;
  max-width: 900px;
  background: #181818;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 2rem;
  color: #fff;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.video-player {
  width: 100%;
  max-height: 70vh;
  display: block;
}

.no-video {
  padding: 4rem 2rem;
  text-align: center;
  font-size: 1.2rem;
  color: #aaa;
}

@media (max-width: 768px) {
  .hero-content {
    padding: 0 2rem;
  }
  .hero-title {
    font-size: 2.2rem;
  }
  .hero-description {
    font-size: 0.95rem;
  }
}
</style>
