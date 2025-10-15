<template>
	<div class="menu_content">
		<div v-for="c in categories" :key="c.title">
			<span class="subtitle">{{ c.title }}</span>
			<div class="subtitle_item">
				<a
					v-for="b in c.boards"
					:key="b"
					@click.prevent="$emit('selectBoard', { category: c.title, board: b })"
					class="js-forum-alliances-list-link"
				>
					{{ b }}
				</a>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
interface ForumCategory { title: string; boards: string[] }
defineProps<{ categories: ForumCategory[] }>();
defineEmits<{ (e: 'selectBoard', payload: { category: string; board: string }): void }>();
</script>
