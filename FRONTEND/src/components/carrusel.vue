<template>
  <div id="carru" class="carrusel-container">
    <div class="carrusel" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div class="slide" v-for="(img, i) in imagenes" :key="i">
        <img :src="img" alt="Imagen carrusel" />
      </div>
    </div>
    <div class="controles">
      <button @click="anterior">‹</button>
      <button @click="siguiente">›</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const imagenes = [
  'https://picsum.photos/id/1015/600/300',
  'https://picsum.photos/id/1016/600/300',
  'https://picsum.photos/id/1018/600/300'
]

const currentIndex = ref(0)

const siguiente = () => {
  currentIndex.value = (currentIndex.value + 1) % imagenes.length
}

const anterior = () => {
  currentIndex.value = (currentIndex.value - 1 + imagenes.length) % imagenes.length
}
</script>

<style scoped>
.carrusel-container {
  width: 600px;
  height: 300px;
  overflow: hidden;
  position: relative;
  margin: 20px auto;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);
  
}

.carrusel {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.slide {
  min-width: 100%;
  height: 100%;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
}

.controles {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  padding: 0 10px;
}

.controles button {
  background-color: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  font-size: 24px;
  padding: 6px 12px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.controles button:hover {
  background-color: rgba(0, 0, 0, 0.6);
}


</style>
