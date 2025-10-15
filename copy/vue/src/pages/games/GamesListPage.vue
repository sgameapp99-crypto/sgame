<template>
  <div class="container mx-auto px-lg py-xl">
    <div class="heading-2">賽事清單</div>
    <div v-if="loading" class="mt-md">載入中…</div>
    <div v-else-if="errorMessage" class="mt-md text-red-600">{{ errorMessage }}</div>
    <div v-else class="card mt-md">
      <div v-if="table">
        <div class="overflow-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-neutral-100">
              <tr>
                <th v-for="h in table.headers" :key="h" class="text-left px-sm py-xs border-b border-neutral-200">{{ h }}</th>
                <th class="px-sm py-xs border-b border-neutral-200">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, idx) in table.rows" :key="idx" class="border-b border-neutral-100">
                <td v-for="(cell, cIdx) in row.cells" :key="cIdx" class="px-sm py-xs">{{ cell.text }}</td>
                <td class="px-sm py-xs">
                  <RouterLink class="btn btn-outline btn-sm" :to="{ name: 'game-detail', params: { id: inferId(row) } }">詳情</RouterLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else class="prose max-w-none" v-html="rewrittenHtml"></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { loadLegacyHtml, parseBasicContent, parseFirstTable, type ParsedTable } from '../../utils/simpleLegacyParser';
import { rewriteLegacyUrls } from '../../utils/rewriteLegacy';

const route = useRoute();
const loading = ref(true);
const errorMessage = ref('');
const rawHtml = ref('');
const rewrittenHtml = computed(() => rewriteLegacyUrls(rawHtml.value));
const table = ref<ParsedTable | null>(null);

onMounted(async () => {
  try {
    const path = (route.query.path as string) || '/legacy/www.playsport.cc/gamesData/';
    const html = await loadLegacyHtml(path);
    const { contentHtml } = parseBasicContent(html);
    rawHtml.value = contentHtml;
    table.value = parseFirstTable(contentHtml);
  } catch (e) {
    errorMessage.value = '載入賽事清單失敗';
    console.error(e);
  } finally {
    loading.value = false;
  }
});

function inferId(row: { cells: { text: string }[] }): string | undefined {
  const first = row.cells[0]?.text || '';
  const m = first.match(/[A-Za-z0-9_-]+/);
  return m ? m[0] : undefined;
}
</script>
