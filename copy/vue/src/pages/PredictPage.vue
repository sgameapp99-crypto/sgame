<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">預測/買牌</div>
    <div v-if="loading" class="mt-md">載入中…</div>
    <div v-else-if="errorMessage" class="mt-md text-red-600">{{ errorMessage }}</div>
    <div v-else class="card mt-md">
      <div v-if="title" class="heading-3">{{ title }}</div>
      <div v-if="rewrittenHtml" class="prose max-w-none" v-html="rewrittenHtml"></div>
      <div v-else class="text-neutral-600">無內容可顯示</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { loadLegacyHtml, parseBasicContent } from '../utils/simpleLegacyParser';
import { rewriteLegacyUrls } from '../utils/rewriteLegacy';
import { useRoute } from 'vue-router';

const route = useRoute();
const loading = ref(true);
const errorMessage = ref('');
const title = ref('');
const rawHtml = ref('');

const rewrittenHtml = computed(() => rewriteLegacyUrls(rawHtml.value));

onMounted(async () => {
  try {
    const path = (route.query.path as string) || '/legacy/www.playsport.cc/predict/';
    const CACHE_KEY = `predict_cache_${path}`;
    const TTL_MS = 5 * 60 * 1000;
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached) as { ts: number; title: string; html: string };
      if (data && Date.now() - data.ts < TTL_MS) {
        title.value = data.title;
        rawHtml.value = data.html;
        loading.value = false;
        return;
      }
    }
    const html = await loadLegacyHtml(path);
    const { title: t, contentHtml } = parseBasicContent(html);
    title.value = t;
    rawHtml.value = contentHtml;
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ ts: Date.now(), title: t, html: contentHtml }),
    );
  } catch (e) {
    errorMessage.value = '載入預測相關內容失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
