# 設計 Tokens 與使用指南（Tailwind）

本專案已在 `tailwind.config.ts` 擴充顏色、字體、間距與圓角等 Tokens。以下為常用說明與範例，設計與開發請優先使用這些 Tokens 以維持一致性。

## 顏色（Colors）
- 主色（Primary）
  - 色階：`primary-50` ~ `primary-900`
  - 常用：
    - 背景：`bg-primary-600`
    - 文字：`text-primary-600`
    - 邊框：`border-primary-300`
- 輔助（Secondary）
  - 色階：`secondary-50` ~ `secondary-900`
  - 常用：`bg-secondary-500`、`text-secondary-700`
- 中性色（Neutral）
  - 色階：`neutral-50` ~ `neutral-900`
  - 常用背景/邊框/文字：`bg-neutral-50`、`border-neutral-200`、`text-neutral-700`

範例：
```html
<button class="bg-primary-600 text-neutral-50 px-md py-sm rounded-md hover:bg-primary-700">
  主要按鈕
</button>
```

## 字體（Typography）
- 家族：`font-sans`（預設）、`font-mono`
- 文字大小（Tailwind 內建）：`text-xs`、`text-sm`、`text-base`、`text-lg`、`text-xl`、`text-2xl`...
- 字重：`font-normal`、`font-medium`、`font-semibold`、`font-bold`

標題範例：
```html
<h2 class="text-xl font-semibold text-neutral-900">區塊標題</h2>
<p class="text-sm text-neutral-600">說明文字</p>
```

## 間距（Spacing）
- 自訂 Tokens：`xs=0.25rem`、`sm=0.5rem`、`md=0.75rem`、`lg=1rem`、`xl=1.5rem`、`2xl=2rem`、`3xl=3rem`
- 常用：
  - 內距：`px-md`、`py-lg`、`p-xl`
  - 外距：`mt-sm`、`mb-md`、`mx-lg`

範例：
```html
<div class="p-lg mb-md bg-neutral-50 border border-neutral-200 rounded-md">
  ...內容...
</div>
```

## 圓角（Radius）
- Tokens：`rounded-sm`、`rounded-md`、`rounded-lg`、`rounded-xl`

範例：
```html
<img class="rounded-lg" src="/img/card.jpg" alt="card" />
```

## 版面（Layout）
- 容器：`container mx-auto px-lg`
- Flex：`flex items-center justify-between gap-sm`
- Grid：`grid grid-cols-12 gap-md`

範例：
```html
<header class="flex items-center justify-between px-lg py-sm bg-neutral-100">
  <div class="text-lg font-semibold">Logo</div>
  <nav class="flex gap-md text-sm text-neutral-700">
    <a class="hover:text-neutral-900" href="#">首頁</a>
    <a class="hover:text-neutral-900" href="#">功能</a>
  </nav>
</header>
```

## 元件樣式建議（可用 @apply 抽共用）
在 `src/assets/main.css`（或新增 `src/assets/components.css`）中建立基礎元件樣式：
```css
.btn {
  @apply inline-flex items-center justify-center px-md py-sm rounded-md font-medium;
}
.btn-primary {
  @apply btn bg-primary-600 text-neutral-50 hover:bg-primary-700;
}
.btn-secondary {
  @apply btn bg-secondary-500 text-neutral-50 hover:bg-secondary-600;
}
.card {
  @apply bg-neutral-50 border border-neutral-200 rounded-md p-lg;
}
```
使用：
```html
<button class="btn-primary">送出</button>
<div class="card">卡片內容</div>
```

## 使用原則
- 優先使用 Tokens 與 Tailwind 類別，避免行內 style。
- 主色/輔色盡量使用 `-600` 作為預設，`-700` 作為 hover，`-500` 作為較亮主題。
- 內距外距使用 `xs~3xl` 階，避免自定數值（除非設計特例）。
- 文字顏色預設使用 `text-neutral-900/700/600` 階層，搭配 `neutral-50/100` 背景與 `neutral-200` 邊框。

## 快速對照表
- **背景/文字**：`bg-primary-600`、`text-neutral-50`、`text-neutral-700`
- **邊框**：`border-neutral-200`
- **間距**：`px-md`、`py-lg`、`mt-sm`、`mb-md`
- **圓角**：`rounded-md`、`rounded-lg`
- **容器/排版**：`container mx-auto px-lg`、`flex items-center gap-sm`、`grid grid-cols-12 gap-md`

---
如需新增 Tokens（新品牌色、更多間距階），請同步更新 `tailwind.config.ts` 並在此文件補充對照。



