<template>
	<div>
		<h3 class="heading-3 my-3">回覆</h3>
		<div v-for="r in replies" :key="r.author + (r.date||'') + Math.random()" class="border-t border-neutral-200 py-3">
			<div class="text-neutral-800 font-semibold">{{ r.author }} <span v-if="r.date" class="text-neutral-500 font-normal">· {{ r.date }}</span></div>
			<div v-html="r.contentHtml"></div>
		</div>
		<div v-if="pages && pages.length" class="mt-3 flex gap-2">
			<button v-for="n in pages" :key="n" @click="$emit('page', n)" class="btn-outline">{{ n }}</button>
		</div>
	</div>
</template>
<script setup lang="ts">
interface Reply { author: string; date?: string; contentHtml: string }
defineProps<{ replies: Reply[]; pages?: number[] }>();
defineEmits<{ (e: 'page', n: number): void }>();
</script>
