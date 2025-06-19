import { ref, onMounted, onUnmounted } from 'vue'

// Gestionnaire global pour synchroniser tous les timers
class GlobalRefreshManager {
  constructor() {
    this.subscribers = new Map()
    this.intervalId = null
    this.intervalMs = 60000 // 60 secondes par défaut
  }

  subscribe(id, callback) {
    this.subscribers.set(id, callback)
    
    // Appel immédiat pour ce nouveau subscriber
    try {
      callback()
    } catch (error) {
      console.error(`Erreur lors du premier appel pour ${id}:`, error)
    }
    
    // Si c'est le premier subscriber, démarrer le timer
    if (this.subscribers.size === 1) {
      this.startGlobalTimer()
    }
  }

  unsubscribe(id) {
    this.subscribers.delete(id)
    
    // Si plus de subscribers, arrêter le timer
    if (this.subscribers.size === 0) {
      this.stopGlobalTimer()
    }
  }

  startGlobalTimer() {
    if (this.intervalId) return
    
    // Timer régulier (pas de premier appel ici car déjà fait dans subscribe)
    this.intervalId = setInterval(() => {
      this.notifyAll()
    }, this.intervalMs)
  }

  stopGlobalTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  notifyAll() {
    this.subscribers.forEach((callback, id) => {
      try {
        callback()
      } catch (error) {
        console.error(`Erreur dans le composant ${id}:`, error)
      }
    })
  }

  setInterval(ms) {
    this.intervalMs = ms
    if (this.intervalId) {
      this.stopGlobalTimer()
      this.startGlobalTimer()
    }
  }
}

// Instance globale unique
const globalManager = new GlobalRefreshManager()

export function useSynchronizedRefresh(fetchFunction, intervalMs = 60000, componentId = 'default') {
  const data = ref(null)
  const isLoading = ref(true)
  const error = ref(null)

  const fetchData = async () => {
    try {
      isLoading.value = true
      error.value = null
      data.value = await fetchFunction()
    } catch (err) {
      error.value = err.message
      console.error('Erreur lors du fetch:', err)
    } finally {
      isLoading.value = false
    }
  }

  onMounted(() => {
    // Configurer l'intervalle global si nécessaire
    if (intervalMs !== globalManager.intervalMs) {
      globalManager.setInterval(intervalMs)
    }
    
    // S'abonner au gestionnaire global (premier appel immédiat inclus)
    globalManager.subscribe(componentId, fetchData)
  })

  onUnmounted(() => {
    // Se désabonner du gestionnaire global
    globalManager.unsubscribe(componentId)
  })

  return {
    data,
    isLoading,
    error,
    fetchData
  }
} 