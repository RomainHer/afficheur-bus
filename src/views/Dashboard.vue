<script setup>
import BusList from '../components/BusList.vue' 
import MiniMap from '../components/MiniMap.vue'
</script>

<template>
  <div class="flex flex-row p-6 h-screen bg-black space-x-6">
    <BusList />
    <MiniMap />
  </div>
</template>