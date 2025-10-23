/**
 * 頭像 URL 工具函數
 * 
 * 根據後端 API 文檔：
 * - avatarUrl 是相對路徑，例如：/uploads/avatars/2-1761063369513.jpg
 * - 前端需要組合為完整 URL
 */

/**
 * 預設黑色頭像（避免載入失敗時的空白）
 */
export const DEFAULT_AVATAR = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23000"/></svg>';

/**
 * 將後端返回的相對路徑 avatarUrl 轉換為完整 URL
 * 
 * @param avatarUrl 後端返回的 avatarUrl (相對路徑或完整 URL)
 * @param addTimestamp 是否添加時間戳避免快取 (預設: false)
 * @returns 完整的頭像 URL
 * 
 * @example
 * ```ts
 * // 後端返回: "/uploads/avatars/2-xxx.jpg"
 * getAvatarUrl("/uploads/avatars/2-xxx.jpg")
 * // 返回: "https://example.com/uploads/avatars/2-xxx.jpg"
 * 
 * // 已經是完整 URL
 * getAvatarUrl("https://example.com/avatar.jpg")
 * // 返回: "https://example.com/avatar.jpg"
 * 
 * // 沒有頭像
 * getAvatarUrl(null)
 * // 返回: DEFAULT_AVATAR
 * ```
 */
export function getAvatarUrl(avatarUrl?: string | null, addTimestamp = false): string {
  // 沒有頭像時返回預設頭像
  if (!avatarUrl) {
    return DEFAULT_AVATAR;
  }

  // 如果已經是完整 URL (http/https 開頭) 或 data URL，直接返回
  if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://') || avatarUrl.startsWith('data:')) {
    return addTimestamp ? addTimestampToUrl(avatarUrl) : avatarUrl;
  }

  // 否則組合為完整 URL
  // avatarUrl 已包含 /uploads/avatars/ 前綴
  const fullUrl = window.location.origin + avatarUrl;
  
  return addTimestamp ? addTimestampToUrl(fullUrl) : fullUrl;
}

/**
 * 為 URL 添加時間戳參數以避免快取
 * 
 * @param url 原始 URL
 * @param timestamp 自訂時間戳 (預設使用當前時間)
 * @returns 帶有時間戳的 URL
 */
export function addTimestampToUrl(url: string, timestamp?: number): string {
  const ts = timestamp ?? Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${ts}`;
}

/**
 * 為頭像 URL 添加時間戳
 * 
 * @param avatarUrl 頭像 URL (相對或絕對)
 * @param timestamp 自訂時間戳
 * @returns 帶有時間戳的完整頭像 URL
 */
export function getAvatarUrlWithTimestamp(avatarUrl?: string | null, timestamp?: number): string {
  return getAvatarUrl(avatarUrl, true);
}


