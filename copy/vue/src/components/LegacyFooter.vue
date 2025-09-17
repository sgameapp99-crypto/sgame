<template>
	<footer class="mt-lg">
		<div v-if="links.length" class="flex flex-wrap gap-3 text-sm mb-2">
			<a v-for="l in links" :key="l.text + l.href" :href="resolveLegacy(l.href)" class="hover:underline">{{ l.text }}</a>
		</div>
		<div v-if="copyRight" class="text-xs text-neutral-500 mb-2">{{ copyRight }}</div>
		<div v-if="html" class="card" v-html="html"></div>
		<div v-else class="text-xs text-neutral-500">© Legacy Footer</div>
	</footer>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { rewriteLegacyUrls } from '../utils/rewriteLegacy';

interface Link {
  text: string;
  href: string;
}
const html = ref('');
const links = ref<Link[]>([]);
const copyRight = ref('');

function resolveLegacy(href: string) {
  if (!href) return '#';
  if (href.startsWith('http')) return href;
  return '/legacy/www.playsport.cc/' + href.replace(/^\/?/, '');
}

onMounted(async () => {
  try {
    const res = await fetch('/legacy/www.playsport.cc/forum/0623c.html', { cache: 'no-store' });
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'text/html');
    // 嘗試取 footer 容器
    const footer = doc.querySelector('.footerbox, #footer, footer') as unknown as HTMLElement | null;
    if (footer) {
      // 解析常見連結
      footer.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href') || '#';
        const text = a.textContent?.trim() || '';
        if (text) links.value.push({ text, href });
      });
      // 解析版權文字（small / copyright 字樣）
      const cr = footer.querySelector('small, .copyright, #copyright');
      copyRight.value = cr?.textContent?.trim() || '';
      html.value = rewriteLegacyUrls(footer.innerHTML);
    } else {
      html.value = '';
    }
  } catch {
    html.value = '';
  }
});
</script>
