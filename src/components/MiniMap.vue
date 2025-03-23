<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { fetchBusPassagesAPI, fetchBusPositionsAPI } from '../composables/useBusAPI';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const busPositions = ref([]);
const isLoading = ref(true);
const mapContainer = ref(null);
let map = null;
let busMarkers = [];

// Création de l'icône de bus personnalisée
const busIcon = L.divIcon({
  className: 'bus-icon',
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3-4H5V6h5.5v7zm5.5 0h-5.5V6H18v7zm1.5 1c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -10]
});

// Création de l'icône d'arrêt de bus personnalisée
const busStopIcon = L.divIcon({
  className: 'bus-stop-icon',
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const initMap = async () => {
  await nextTick();
  
  if (mapContainer.value) {
    try {
      map = L.map(mapContainer.value, {
        center: [48.10226173913813, -1.6569458420151653],
        zoom: 14,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      const mapPane = map.getPane('overlayPane');
      mapPane.style.clipPath = 'circle(500px at center)';

      map.invalidateSize();
      
      // Ajouter le marqueur d'arrêt de bus
      L.marker([48.10198667468977, -1.6565588121881487], { icon: busStopIcon })
        .bindPopup('Arrêt de bus')
        .addTo(map);
      
      if (busPositions.value.results) {
        updateBusMarkers();
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la carte:', error);
    }
  }
};

const updateBusMarkers = () => {
  if (!map) return;

  busMarkers.forEach(marker => marker.remove());
  busMarkers = [];

  if (busPositions.value.results) {
    busPositions.value.results.forEach(bus => {
      const marker = L.marker([bus.coordonnees.lat, bus.coordonnees.lon], { icon: busIcon })
        .bindPopup(`Bus ${bus.nomcourtligne}<br>Retard: ${bus.ecartsecondes}s`)
        .addTo(map);
      busMarkers.push(marker);
    });
  }
};

watch(isLoading, (newValue) => {
  if (!newValue) {
    initMap();
  }
});

watch(busPositions, () => {
  if (map) {
    updateBusMarkers();
  }
});

onMounted(() => {
  // Initialisation vide
});

fetchBusPassagesAPI().then(data => {
  const busIds = [];
  data.results.forEach(passage => {
    if (passage.idbus) {
      busIds.push(passage.idbus);
    }
  });
  fetchBusPositionsAPI(busIds).then(data => {
    busPositions.value = data;
    isLoading.value = false;
  });
});
</script>

<template>
  <div class="w-1/2">
    <h1 class="text-xl font-bold">Mini Map</h1>
    <div class="relative w-full h-[500px]">
      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-white rounded-full">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
      <div v-else ref="mapContainer" class="absolute inset-0 rounded-full overflow-hidden"></div>
    </div>
  </div>
</template>

<style scoped>
.leaflet-container {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 1;
}

.bus-icon {
  color: #2563eb;
  background: none;
  border: none;
}

.bus-icon svg {
  width: 24px;
  height: 24px;
}

.bus-stop-icon {
  color: #dc2626;
  background: none;
  border: none;
}

.bus-stop-icon svg {
  width: 32px;
  height: 32px;
}
</style>