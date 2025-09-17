<template>
	<nav class="flex gap-4 items-center flex-wrap">
		<div v-for="m in menus" :key="m.text + m.href" class="relative">
			<RouterLink :to="resolveLegacy(m.href)" class="font-medium hover:underline">{{ m.text }}</RouterLink>
			<span v-if="m.children && m.children.length" class="ml-1 text-xs text-neutral-500">▼</span>
			<div v-if="m.children && m.children.length" class="mt-1 flex gap-2 text-sm text-neutral-700">
				<RouterLink
					v-for="c in m.children"
					:key="c.text + c.href"
					:to="resolveLegacy(c.href)"
					class="hover:underline"
				>
					{{ c.text }}
				</RouterLink>
			</div>
		</div>
	</nav>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface MenuItem {
  text: string;
  href: string;
  children?: MenuItem[];
}
const menus = ref<MenuItem[]>([]);

function resolveLegacy(href: string) {
  if (!href) return '#';
  if (href.startsWith('http')) return href;
  return '/legacy/www.playsport.cc/' + href.replace(/^\/?/, '');
}

onMounted(async () => {
  const res = await fetch('/legacy/www.playsport.cc/forum/0623c.html', { cache: 'no-store' });
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
  // 解析頂層與子選單
  doc.querySelectorAll('#smoothmenu1 .drop-down-menu > li').forEach((li) => {
    const topA = li.querySelector(':scope > a');
    if (!topA) return;
    const item: MenuItem = {
      text: topA.textContent?.trim() || '',
      href: topA.getAttribute('href') || '#',
      children: [],
    };
    li.querySelectorAll(':scope > ul > li > a').forEach((sub) => {
      item.children?.push({ text: sub.textContent?.trim() || '', href: sub.getAttribute('href') || '#' });
    });
    menus.value.push(item);
  });
});
</script>
