export async function loadLegacyHtml(legacyPath: string): Promise<string> {
	const res = await fetch(legacyPath, { cache: 'no-store' });
	return await res.text();
}

export function parseBasicContent(html: string): { title: string; contentHtml: string } {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	const title =
		doc.querySelector('h1')?.textContent?.trim() ||
		doc.querySelector('title')?.textContent?.trim() ||
		'';
	const candidates = [
		'#main',
		'#content',
		'.content',
		'#center',
		'main',
		'table.helpTf',
		'body'
	];
	let container: Element | null = null;
	for (const sel of candidates) {
		const el = doc.querySelector(sel);
		if (el) {
			container = el;
			break;
		}
	}
	const contentHtml = (container as HTMLElement | null)?.innerHTML || '';
	return { title, contentHtml };
}

export interface TableCell { text: string }
export interface TableRow { cells: TableCell[] }
export interface ParsedTable { headers: string[]; rows: TableRow[] }

export function parseFirstTable(html: string): ParsedTable | null {
	const doc = new DOMParser().parseFromString(html, 'text/html');
	const table = doc.querySelector('table');
	if (!table) return null;
	const headers: string[] = [];
	const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
	if (headerRow) {
		headerRow.querySelectorAll('th').forEach((th) => headers.push((th.textContent || '').replace(/\s+/g, ' ').trim()));
	}
	const rows: TableRow[] = [];
	(table.querySelectorAll('tbody tr').length ? table.querySelectorAll('tbody tr') : table.querySelectorAll('tr'))
		.forEach((tr, idx) => {
			if (idx === 0 && headers.length) return; // skip header if headers present
			const cells: TableCell[] = [];
			tr.querySelectorAll('td').forEach((td) => {
				cells.push({ text: (td.textContent || '').replace(/\s+/g, ' ').trim() });
			});
			if (cells.length) rows.push({ cells });
		});
	return { headers, rows };
}

