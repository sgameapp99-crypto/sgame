<template>
  <article>
    <h2 class="mb-3">{{ title }}</h2>
    <div v-html="contentHtml"></div>
  </article>
</template>
<script setup lang="ts">
defineProps<{ title: string; contentHtml: string }>();
</script>
