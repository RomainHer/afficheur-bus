<script setup>
import { ref } from 'vue';
import { fetchBusPassagesAPI } from '../composables/useBusAPI';

const busPassages = ref([]);
const isLoading = ref(true);

const lineStyles = {
  C1: "bg-lime-400 text-black",
  11: "bg-blue-700 text-white",
};

function getLineClass(nomcourtligne) {
  return (lineStyles[nomcourtligne] || "bg-gray-300 text-black") +
    " rounded-xl font-bold px-3 py-1 text-2xl";
}

fetchBusPassagesAPI().then(data => {
  busPassages.value = data;
  isLoading.value = false;
});

</script>

<template>
  <div class="w-1/2">
    <h1 class="text-xl font-bold">Liste des bus</h1>
    <div v-if="isLoading" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <div v-for="passage in busPassages.results" class="flex justify-between mb-3" :key="passage.idcourse">
      <div class="flex flex-row">
        <div :class="getLineClass(passage.nomcourtligne)">{{ passage.nomcourtligne }}</div>
        <span>{{ passage.destination }}</span>
      </div>
      <span>{{ passage.depart === passage.arrivee ?  Math.round((new Date(passage.arrivee) - new Date()) / 60000) + " min" : Math.round((new Date(passage.depart) - new Date()) / 60000) + " min" }}</span>
    </div>
  </div>
</template>