<template>
  <div class="movie-carousel-section" v-if="movies && movies.length > 0">
    <h2 class="carousel-title">{{ title }}</h2>

    <div class="carousel-container">
      <button class="carousel-control prev" @click="scrollLeft" aria-label="Anterior">
        &#10094;
      </button>

      <div class="carousel-track" ref="track">
        <MovieCard
          v-for="movie in movies"
          :key="movie._id"
          :movie="movie"
        />
      </div>

      <button class="carousel-control next" @click="scrollRight" aria-label="Siguiente">
        &#10095;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import MovieCard from "./MovieCard.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  movies: {
    type: Array,
    required: true,
  },
});

const track = ref(null);

const scrollLeft = () => {
  if (track.value) {
    track.value.scrollBy({ left: -600, behavior: "smooth" });
  }
};

const scrollRight = () => {
  if (track.value) {
    track.value.scrollBy({ left: 600, behavior: "smooth" });
  }
};
</script>

<style scoped>
.movie-carousel-section {
  margin-bottom: 2.5rem;
  padding: 0 4rem;
}

.carousel-title {
  color: #e5e5e5;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
}

.carousel-container {
  position: relative;
}

.carousel-track {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.8rem 0;
}

.carousel-track::-webkit-scrollbar {
  display: none;
}
.carousel-track {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.3s, background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-container:hover .carousel-control {
  opacity: 1;
}

.carousel-control:hover {
  background: rgba(0, 0, 0, 0.8);
}

.carousel-control.prev {
  left: 0;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.carousel-control.next {
  right: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

@media (max-width: 768px) {
  .movie-carousel-section {
    padding: 0 1.5rem;
  }
  .carousel-control {
    display: none;
  }
}
</style>
