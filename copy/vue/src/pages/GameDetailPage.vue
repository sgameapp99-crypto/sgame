<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">賽事詳情</div>
    <div v-if="loading" class="mt-md">載入中…</div>
    <div v-else-if="errorMessage" class="mt-md text-red-600">{{ errorMessage }}</div>
    <div v-else class="card mt-md">
      <div v-if="table">
        <div class="grid gap-md md:grid-cols-2">
          <div>
            <div class="heading-3">基本資訊</div>
            <table class="mt-sm w-full text-sm">
              <tbody>
                <tr v-for="(row, idx) in table.rows" :key="idx" class="border-b border-neutral-100">
                  <td class="px-sm py-xs text-neutral-600">{{ table.headers[idx] || `欄位${idx+1}` }}</td>
                  <td class="px-sm py-xs">{{ row.cells[0]?.text }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <div class="heading-3">操作</div>
            <div class="mt-sm flex gap-sm">
              <button class="btn btn-primary">加入追蹤</button>
              <RouterLink class="btn btn-outline" :to="{ name: 'predict-buy', query: { path: '/legacy/www.playsport.cc/buyPredict/' } }">前往購買</RouterLink>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="prose max-w-none" v-html="rewrittenHtml"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadLegacyHtml, parseBasicContent, parseFirstTable, type ParsedTable } from '../utils/simpleLegacyParser';
import { rewriteLegacyUrls } from '../utils/rewriteLegacy';

const route = useRoute();
const loading = ref(true);
const errorMessage = ref('');
const rawHtml = ref('');
const rewrittenHtml = computed(() => rewriteLegacyUrls(rawHtml.value));
const table = ref<ParsedTable | null>(null);

onMounted(async () => {
  try {
    const id = route.params.id as string | undefined;
    // 允許以 ?path 指定完整 legacy 檔案；否則嘗試以 id 推測
    const fallback = id
      ? `/legacy/www.playsport.cc/gamesData/${id}.html`
      : '/legacy/www.playsport.cc/gamesData/';
    const path = (route.query.path as string) || fallback;
    const html = await loadLegacyHtml(path);
    const { contentHtml } = parseBasicContent(html);
    rawHtml.value = contentHtml;
    table.value = parseFirstTable(contentHtml);
  } catch (e) {
    errorMessage.value = '載入賽事詳情失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
