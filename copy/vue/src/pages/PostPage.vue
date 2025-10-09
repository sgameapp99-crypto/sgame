<template>
	<div>
		<div class="p-4 space-y-lg">
			<div class="card">
				<PostContent :title="title" :content-html="contentHtml" />
			</div>
			<div class="card">
				<ReplyList :replies="replies" :pages="replyPages" @page="onReplyPage" />
			</div>
			</div>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import PostContent from '../components/PostContent.vue'
import ReplyList from '../components/ReplyList.vue'
import { parsePost, parsePostReplies } from '../utils/legacyParser'
import { rewriteLegacyUrls } from '../utils/rewriteLegacy'

const route = useRoute()
const title = ref('')
const contentHtml = ref('')
const replies = ref<{ author: string; date?: string; contentHtml: string }[]>([])
const replyPages = ref<number[] | undefined>(undefined)

async function load(page?: number) {
	const id = String(route.params.id || '')
	if (!id) return
	const base = `/legacy/www.playsport.cc/forum/post/${id}.html`
	const url = page && page > 1 ? `${base}?pageno=${page}` : base
	const res = await fetch(url, { cache: 'no-store' })
	const html = await res.text()
	const post = parsePost(html)
	title.value = post.title
	contentHtml.value = rewriteLegacyUrls(post.contentHtml)
	const pr = parsePostReplies(html)
	replies.value = pr.replies.map(r => ({ ...r, contentHtml: rewriteLegacyUrls(r.contentHtml) }))
	replyPages.value = pr.pagination?.pages
}

function onReplyPage(n: number) { load(n) }

onMounted(async () => { await load(1) })
</script>
