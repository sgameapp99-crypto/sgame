<template>
  <iframe :src="src" class="w-full h-full border-0" />
</template>
<script setup lang="ts">
interface Props {
  src: string;
}
defineProps<Props>();
</script>
