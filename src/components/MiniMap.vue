<script setup>
import { ref } from 'vue';
import { fetchBusPassagesAPI, fetchBusPositionsAPI } from '../composables/useBusAPI';

const busPositions = ref([]);
const isLoading = ref(true);

fetchBusPassagesAPI().then(data => {
  const busIds = [];
  data.results.forEach(passage => {
    if (passage.idbus) {
      console.log(passage.idbus);
      busIds.push(passage.idbus);
    }
  });
  console.log(busIds);
  fetchBusPositionsAPI(busIds).then(data => {
    busPositions.value = data;
    isLoading.value = false;
  });
});

</script>

<template>
  <div class="w-1/2">
    <h1 class="text-xl font-bold">Mini Map</h1>
    <div v-if="isLoading" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    <pre v-else>{{ busPositions }}</pre>
  </div>
</template>