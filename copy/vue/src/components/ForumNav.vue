<template>
	<div>
		<section v-if="navLinks.length" class="mb-3">
			<strong>導覽：</strong>
			<RouterLink v-for="l in navLinks" :key="l.text+l.href" :to="resolveLegacy(l.href)" class="mr-2 hover:underline">{{ l.text }}</RouterLink>
		</section>
		<section v-if="categories.length" class="mb-4">
			<div v-for="c in categories" :key="c.title" class="mb-4">
				<h3 class="heading-3 mb-1">{{ c.title }}</h3>
				<ul class="flex flex-wrap gap-2 m-0 p-0 list-none">
					<li v-for="b in c.boards" :key="b">
						<button type="button" @click="$emit('selectBoard', { category: c.title, board: b })" class="btn-outline">{{ b }}</button>
					</li>
				</ul>
			</div>
		</section>
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
