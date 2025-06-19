<script setup>
import { useSynchronizedRefresh } from '../composables/useSynchronizedRefresh'
import { fetchBusPassagesAPI } from '../composables/useBusAPI'

const { data: busPassages, isLoading, error } = useSynchronizedRefresh(fetchBusPassagesAPI, 60000, 'BusList')

const lineStyles = {
  C1: "bg-lime-400 text-black",
  11: "bg-blue-700 text-white",
};

function getLineClass(nomcourtligne) {
  return (lineStyles[nomcourtligne] || "bg-gray-300 text-black") +
    " rounded-xl font-bold px-3 py-1 text-2xl";
}

function formatTimeToDeparture(passage) {
  const timeToDeparture = passage.depart === passage.arrivee 
    ? Math.round((new Date(passage.arrivee) - new Date()) / 60000)
    : Math.round((new Date(passage.depart) - new Date()) / 60000);
  
  if (timeToDeparture < 0) {
    return "Passé";
  }
  
  if (timeToDeparture === 0) {
    return "Imminent";
  }
  
  return `${timeToDeparture} min`;
}
</script>

<template>
  <div class="w-1/2 flex flex-col" style="height: calc(100vh - 48px);">
    <div class="bg-gray-900 rounded-lg p-4 mb-4 border-l-4 border-yellow-400">
      <h1 class="text-2xl font-bold text-yellow-400 text-center tracking-wider">ARRÊT MOUEZY</h1>
      <div class="text-center text-gray-300 text-sm mt-1">PROCHAINS DÉPARTS</div>
      <div class="text-center text-xs text-gray-400 mt-1">
        Mise à jour synchronisée toutes les minutes
      </div>
    </div>
    
    <div v-if="error" class="bg-red-900 rounded-lg p-4 mb-4 text-red-200">
      Erreur: {{ error }}
    </div>
    
    <div v-if="isLoading" class="flex items-center justify-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
    
    <div class="flex-1 overflow-y-auto pr-2 min-h-0">
      <div v-for="passage in busPassages?.results" 
           class="bg-gray-800 rounded-lg shadow-lg p-4 mb-3 hover:bg-gray-700 transition-colors duration-200 border-l-4 border-green-400" 
           :key="passage.idcourse">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-3">
            <div :class="getLineClass(passage.nomcourtligne)">{{ passage.nomcourtligne }}</div>
            <div class="flex flex-col">
              <span class="font-medium text-white">{{ passage.destination }}</span>
              <span class="text-sm text-gray-400">Direction</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-3xl font-bold text-green-400">
              {{ formatTimeToDeparture(passage) }}
            </span>
            <div class="text-xs text-gray-400">départ</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style de la barre de défilement */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #374151;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Pour Firefox */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 #374151;
}
</style>