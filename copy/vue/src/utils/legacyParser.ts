export interface ForumCategory { title: string; boards: string[] }
export interface ForumPostRow {
	title: string;
	href: string;
	author: string;
	authorDate?: string;
	lastReplyUser?: string;
	lastReplyDate?: string;
	lastReplyAuthor?: string; // 別名
	subjectId?: string;
	pinned?: boolean;
	pushCount?: number;
	boardTag?: string;
	replyCount?: number;
	viewCount?: number;
	avatar?: string;
	pages?: number[];
}

export interface ForumPagination { current: number; pages: number[] }

function parseHTML(html: string): Document {
	try {
		return new DOMParser().parseFromString(html, 'text/html');
	} catch {
		// Return empty document-like structure on failure
		return new DOMParser().parseFromString('<!doctype html><html></html>', 'text/html');
	}
}

function text(el: Element | null | undefined): string {
	return (el?.textContent || '').replace(/\s+/g, ' ').trim();
}

function attr(el: Element | null | undefined, name: string): string {
	return el?.getAttribute(name) || '';
}

function selectAll(doc: ParentNode, selectors: string[]): Element[] {
	for (const sel of selectors) {
		const nodes = Array.from(doc.querySelectorAll(sel));
		if (nodes.length) return nodes;
	}
	return [];
}

function selectOne(doc: ParentNode, selectors: string[]): Element | null {
	for (const sel of selectors) {
		const node = doc.querySelector(sel);
		if (node) return node;
	}
	return null;
}

export async function loadLegacyForumHtml(): Promise<string> {
	const res = await fetch('/legacy/www.playsport.cc/forum34f6.html', { cache: 'no-store' });
	return await res.text();
}

export function parseForum(html: string): {
	navLinks: { text: string; href: string }[];
	categories: ForumCategory[];
	posts: ForumPostRow[];
	pagination: ForumPagination | null;
} {
	const doc = parseHTML(html);

	// nav links
	const navLinks: { text: string; href: string }[] = [];
	selectAll(doc, ['#navi a', '.navi a']).forEach((a) => {
		navLinks.push({ text: text(a), href: attr(a, 'href') || '#' });
	});

	// categories
	const categories: ForumCategory[] = [];
	selectAll(doc, ['.menu_title']).forEach((titleEl) => {
		const title = text(titleEl);
		const content = (titleEl.nextElementSibling as HTMLElement | null) || null;
		const boards: string[] = [];
		if (content) {
			content.querySelectorAll('span.subtitle').forEach((s) => boards.push(text(s)));
		}
		if (title) categories.push({ title, boards });
	});

	// posts
	const posts: ForumPostRow[] = [];
	const table = (selectOne(doc, ['#forumTable', 'table.forum', 'table.helpTf']) as HTMLTableElement | null);
	if (table) {
		Array.from(table.querySelectorAll('tr')).forEach((tr) => {
			const titleCell = tr.querySelector('td.article-title') as HTMLTableCellElement | null;
			if (!titleCell) return;
			const linkEl = titleCell.querySelector('a[href]') as HTMLAnchorElement | null;
			const rawTitle = (linkEl?.textContent || titleCell.textContent || '').replace(/\s+/g, ' ').trim();
			const href = attr(linkEl, 'href') || '#';
			const subjectId = attr(linkEl, 'data-subjectid') || undefined;
			const pinned = tr.getAttribute('bgcolor') === '#ffff99';

			let pushCount: number | undefined;
			const pushEl = (tr.querySelector('.betrec .pushit, .pushcount, .pushcount a') as HTMLElement | null);
			if (pushEl) {
				const n = parseInt(pushEl.textContent || '', 10);
				if (!Number.isNaN(n)) pushCount = n;
			}
			const boardMatch = rawTitle.match(/^\[(.+?)\]\s*/);
			const boardTag = boardMatch ? boardMatch[1] : undefined;
			const title = rawTitle;

			// reply/view counts fallback
			let replyCount: number | undefined;
			let viewCount: number | undefined;
			const numText = titleCell.textContent || '';
			const pair = numText.match(/\((\d+)\s*\/\s*(\d+)\)/);
			if (pair) {
				replyCount = parseInt(pair[1], 10);
				viewCount = parseInt(pair[2], 10);
			}

			const tds = tr.querySelectorAll('td');
			const authorCell = (tds[2] as HTMLTableCellElement | undefined) || null;
			const latestCell = (tds[3] as HTMLTableCellElement | undefined) || null;
			const authorLink = (authorCell?.querySelector('a') as HTMLAnchorElement | null);
			const author = (authorLink?.childNodes?.[0]?.textContent || authorCell?.textContent || '').replace(/\s+/g, ' ').trim();
			const authorDate = text(authorCell?.querySelector('.articleDateTime') as Element);
			const lastReplyLink = (latestCell?.querySelector('a') as HTMLAnchorElement | null);
			const lastReplyUser = (lastReplyLink?.childNodes?.[0]?.textContent || latestCell?.textContent || '').replace(/\s+/g, ' ').trim();
			const lastReplyDate = text(latestCell?.querySelector('.articleDateTime') as Element);

			posts.push({ title, href, author, authorDate, lastReplyUser, lastReplyDate, subjectId, pinned, pushCount, boardTag, replyCount, viewCount });
		});
	}

	// pagination
	let pagination: ForumPagination | null = null;
	const pag = selectOne(doc, ['.pagination.sabrosus', '.pagination']);
	if (pag) {
		const current = parseInt(text(pag.querySelector('li.current')), 10) || 1;
		const pages: number[] = [];
		pag.querySelectorAll('a[href*="pageno="]').forEach((a) => {
			const m = (a as HTMLAnchorElement).href.match(/pageno=(\d+)/);
			if (m) pages.push(parseInt(m[1], 10));
		});
		const uniq = Array.from(new Set([current, ...pages])).sort((a, b) => a - b);
		pagination = { current, pages: uniq };
	}

	return { navLinks, categories, posts, pagination };
}

export function parsePost(html: string): { title: string; contentHtml: string } {
	const doc = parseHTML(html);
	const title = text(selectOne(doc, ['h1.title', '.title', 'h1']));
	const contentTd = (selectOne(doc, ['td.tdContent', '.tdContent']) as HTMLElement | null);
	const contentHtml = contentTd ? contentTd.innerHTML : '';
	return { title, contentHtml };
}

export interface PostReply { author: string; date?: string; contentHtml: string }
export interface PostRepliesResult { replies: PostReply[]; pagination: ForumPagination | null }

export function parsePostReplies(html: string): PostRepliesResult {
	const doc = parseHTML(html);
	const tables = Array.from(doc.querySelectorAll('table.helpTf.helpTf_mobile')) as HTMLTableElement[];
	const replies: PostReply[] = [];
	// 第一個視為主文，後續視為回覆（有些頁面樣式可能不同，加入容錯）
	tables.slice(1).forEach((t) => {
		const author = (t.querySelector('.nickname a')?.textContent || t.querySelector('.nickname')?.textContent || '').replace(/\s+/g, ' ').trim();
		let date: string | undefined;
		const optSpan = t.querySelector('.forumdetail_options span');
		if (optSpan) date = text(optSpan);
		// 內容欄位
		let contentCell = (t.querySelector('td[v-pre]') as HTMLElement | null) || (t.querySelector('td.forumdetailhelpClearf') as HTMLElement | null);
		if (!contentCell) {
			const tds = t.querySelectorAll('td');
			contentCell = (tds[tds.length - 1] as HTMLElement) || null;
		}
		const contentHtml = contentCell ? contentCell.innerHTML : '';
		replies.push({ author, date, contentHtml });
	});
	// 分頁
	let pagination: ForumPagination | null = null;
	const pag = selectOne(doc, ['.pagination.sabrosus', '.pagination']);
	if (pag) {
		const current = parseInt(text(pag.querySelector('li.current')), 10) || 1;
		const pages: number[] = [];
		pag.querySelectorAll('a[href*="pageno="]').forEach((a) => {
			const m = (a as HTMLAnchorElement).href.match(/pageno=(\d+)/);
			if (m) pages.push(parseInt(m[1], 10));
		});
		const uniq = Array.from(new Set([current, ...pages])).sort((a, b) => a - b);
		pagination = { current, pages: uniq };
	}
	return { replies, pagination };
}
