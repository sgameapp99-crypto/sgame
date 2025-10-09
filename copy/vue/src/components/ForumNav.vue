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
		<div v-if="navLinks.length">
			<a style="color:red;" href="forum.html">全部</a>
			<div class="subtitle_item">
				<a
					v-for="l in navLinks"
					:key="l.text+l.href"
					:to="resolveLegacy(l.href)"
					class="js-forum-alliances-list-link"
				>
					{{ l.text }}
				</a>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
interface NavLink { text: string; href: string }
interface ForumCategory { title: string; boards: string[] }
defineProps<{ navLinks: NavLink[]; categories: ForumCategory[] }>();
defineEmits<{ (e: 'selectBoard', payload: { category: string; board: string }): void }>();
function resolveLegacy(href: string) {
	if (!href) return '#'
	if (href.startsWith('http')) return href
	return '/legacy/www.playsport.cc/' + href.replace(/^\/?/, '')
}
</script>
