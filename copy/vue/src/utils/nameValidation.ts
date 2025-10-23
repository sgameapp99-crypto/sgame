/**
 * 用戶名稱驗證工具
 * 
 * 根據後端 API 規範實作驗證邏輯
 * API 文檔: /api/前端整合文檔/用戶名稱功能說明.md
 */

/**
 * 驗證用戶名稱
 * 
 * @param name 要驗證的名稱
 * @returns 驗證錯誤陣列，空陣列代表驗證通過
 * 
 * @example
 * ```typescript
 * const errors = validateName('張Peter');
 * if (errors.length === 0) {
 *   console.log('名稱有效');
 * } else {
 *   console.log('驗證錯誤:', errors);
 * }
 * ```
 */
export function validateName(name: string): string[] {
  const errors: string[] = [];
  
  // 檢查是否為空
  if (!name || typeof name !== 'string') {
    errors.push('名稱不可為空');
    return errors;
  }

  // 去除首尾空白
  const trimmedName = name.trim();

  // 檢查長度（2-10 字元）
  if (trimmedName.length < 2) {
    errors.push('名稱長度至少需要 2 個字元');
  } else if (trimmedName.length > 10) {
    errors.push('名稱長度不可超過 10 個字元');
  }

  // 檢查是否僅包含中英文
  // 中文範圍: \u4e00-\u9fa5 (CJK Unified Ideographs)
  // 英文範圍: a-zA-Z
  const onlyChineseEnglishRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
  
  if (!onlyChineseEnglishRegex.test(trimmedName)) {
    errors.push('名稱僅允許中文和英文字母');
  }

  return errors;
}

/**
 * 檢查名稱是否有效
 * 
 * @param name 要檢查的名稱
 * @returns true 表示有效，false 表示無效
 * 
 * @example
 * ```typescript
 * if (isValidName('測試用戶')) {
 *   console.log('名稱有效');
 * }
 * ```
 */
export function isValidName(name: string): boolean {
  return validateName(name).length === 0;
}

/**
 * 驗證名稱長度
 * 
 * @param name 要驗證的名稱
 * @returns true 表示長度有效
 */
export function isValidNameLength(name: string): boolean {
  const length = name.trim().length;
  return length >= 2 && length <= 10;
}

/**
 * 驗證名稱內容（僅中英文）
 * 
 * @param name 要驗證的名稱
 * @returns true 表示內容有效
 */
export function isValidNameContent(name: string): boolean {
  const onlyChineseEnglishRegex = /^[\u4e00-\u9fa5a-zA-Z]+$/;
  return onlyChineseEnglishRegex.test(name.trim());
}

/**
 * 名稱驗證結果介面
 */
export interface NameValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * 獲取詳細的驗證結果
 * 
 * @param name 要驗證的名稱
 * @returns 驗證結果物件
 * 
 * @example
 * ```typescript
 * const result = getNameValidationResult('測試123');
 * console.log(result.valid); // false
 * console.log(result.errors); // ['名稱僅允許中文和英文字母']
 * ```
 */
export function getNameValidationResult(name: string): NameValidationResult {
  const errors = validateName(name);
  return {
    valid: errors.length === 0,
    errors,
  };
}


