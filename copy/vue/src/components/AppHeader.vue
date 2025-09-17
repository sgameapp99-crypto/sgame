<template>
  <header class="px-2 py-2 bg-neutral-900 text-white flex items-center gap-3">
    <strong>Playsport (Vue)</strong>
    <LegacyHeader />
    <nav class="flex gap-2 ml-auto">
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/forum">Forum</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/register">Register</RouterLink>
      <RouterLink to="/member">Member</RouterLink>
      <RouterLink to="/predict">Predict</RouterLink>
      <RouterLink to="/predict/buy">Buy</RouterLink>
      <RouterLink to="/games">Games</RouterLink>
      <RouterLink to="/games/list">Games List</RouterLink>
    </nav>
  </header>
</template>
<script setup lang="ts">
import LegacyHeader from './LegacyHeader.vue';
</script>
