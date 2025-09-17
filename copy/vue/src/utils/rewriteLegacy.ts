export function rewriteLegacyUrls(html: string): string {
  if (!html) return html;
  let s = html;
  // img src 相對路徑 -> /legacy/www.playsport.cc/
  s = s.replace(
    /(<img[^>]+src=")(?!https?:|\/legacy\/|data:|\/www\.|\.\.\/|\/)([^"'>]+)/gi,
    '$1/legacy/www.playsport.cc/$2',
  );
  s = s.replace(/(<img[^>]+src=")(\.\.\/)+/gi, '$1/legacy/www.playsport.cc/');
  // a href 相對路徑
  s = s.replace(
    /(<a[^>]+href=")(?!https?:|\/legacy\/|mailto:|tel:|#|\/www\.|\.\.\/|\/)([^"'>]+)/gi,
    '$1/legacy/www.playsport.cc/$2',
  );
  s = s.replace(/(<a[^>]+href=")(\.\.\/)+/gi, '$1/legacy/www.playsport.cc/');
  // 其他資源 (source/video/audio/script/link)
  s = s.replace(
    /(<(source|video|audio|script|link)[^>]+(?:src|href)=")(?!https?:|\/legacy\/|data:|\/www\.|\.\.\/|\/)([^"'>]+)/gi,
    '$1/legacy/www.playsport.cc/$3',
  );
  s = s.replace(
    /(<(source|video|audio|script|link)[^>]+(?:src|href)=")(\.\.\/)+/gi,
    '$1/legacy/www.playsport.cc/',
  );
  return s;
}
