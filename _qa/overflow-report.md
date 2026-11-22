# Horizontal overflow diagnosis — Dorika storefront (localhost:3001)

Read-only inspection. No project files edited. Browser: built-in browser (viewport resize per width, page reloaded each time).

## 1. Measured widths (home page `/`)

| Viewport | innerWidth | documentElement.scrollWidth | body.scrollWidth | Horizontal scroll? |
|---|---|---|---|---|
| 1440x900  | 1440 | 1440 | 1440 | No |
| 1280x800  | 1280 | 1280 | 1280 | No |
| 1024x768  | 1024 | 1024 | 1024 | No |
| 820x1180  | 820  | 820  | 820  | No |
| 390x844   | 390  | 390  | 390  | No |

Also probed 1023x768 (between breakpoints): 1023 / 1023 / 1023 — No.

## 2. `/shop`

| Viewport | innerWidth | doc.scrollWidth | body.scrollWidth | Horizontal scroll? | Document height |
|---|---|---|---|---|---|
| 1024x768 | 1024 | 1024 | 1024 | No | 2231 |
| 390x844  | 390  | 390  | 390  | No | 4144 |

## 3. Why no scrollWidth is reported (root cause of "masked" overflow)

Both roots carry horizontal clipping:

- `html` → `overflow-x: clip`
- `body` → `overflow-x: clip`  (Tailwind `overflow-x-clip`)

Clothing/`clip` suppresses document-level horizontal scrolling, so `scrollWidth` is clamped to the viewport at every width. The bug is therefore **latent/clipped**, not scrollable: content is laid out past the right edge and silently cut off by `overflow-x: clip` instead of producing a scrollbar.

## 4. Elements whose right edge exceeds innerWidth (closed off-canvas panels)

### Cart drawer — `<aside>` (all widths)
`class="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col border-l border-line bg-..."`
`position: fixed`, `transform: matrix(1,0,0,1,440,0)` (translate-x-full, closed state).

| Viewport | left | right | width | overflow past right edge |
|---|---|---|---|---|
| 1440 | 1440 | 1880 | 440 | +440 |
| 1280 | 1280 | 1720 | 440 | +440 |
| 1024 | 1024 | 1464 | 440 | +440 |
| 820  | 820  | 1260 | 440 | +440 |
| 390  | 390  | 780  | 390 | +390 |

Children inherit the offset (all inside the drawer, "Your basket is empty" state):
- `<header class="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-line px-5">` — right 1464 @1024 (1880 @1440, 1720 @1280, 1260 @820, 780 @390)
- `<div class="flex flex-1 flex-col items-center justify-center px-8 text-center">` — right 1464 @1024
- `<div class="flex h-16 w-16 items-center justify-center rounded-full border border-line">` — right 1277 @1024
- `<p class="mt-5 font-display text-xl tracking-tight text-ink">` — right 1318 @1024
- `<a class="mt-4 text-sm text-ink-soft link-thread hover:text-ink">` — right 1326 @1024
- `<a class="btn-primary btn-md mt-6">` — right 1331 @1024
- `<p class="mt-2 max-w-[24ch] text-sm leading-relaxed text-ink-soft">` — right 1350 @1024
- close `<button class="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:bg-paper-2 ...">` — right 1444 @1024

### Mobile nav panel — `<div>` (present at 820 and 390; not in DOM at ≥1024)
`class="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-paper transition-transform ..."`
`position: absolute`, `transform: matrix(1,0,0,1,420,0)` @820 → right 1240; `matrix(1,0,0,1,390,0)` @390 → right 780.

Children inheriting the offset:
- `<div class="flex h-[68px] flex-shrink-0 items-center justify-between border-b border-line px-5">` — right 1240 @820 / 780 @390
- `<div class="flex-1 overflow-y-auto px-5 py-6">` — right 1240 / 780
- `<div class="flex-shrink-0 border-t border-line px-5 py-4">` — right 1240 / 780
- close `<button class="flex h-9 w-9 items-center justify-center rounded-xs text-ink hover:bg-paper-2">` — right 1220 @820 / 760 @390
- `<ul class="divide-y divide-line">` — right 760 @390
- `<a class="group flex items-baseline justify-between py-4">` — right 760 @390
- `<span class="font-mono text-[0.625rem] tracking-[0.14em] text-ink-faint">` — right 760 @390

No other section (hero, header, product grid, footer) has any box extending past the viewport at any tested width.

## 5. Header at 1024

Nav box: `NAV.shell ...` left 0, right 1024, width 1024, `scrollWidth == clientWidth == 1024`.
Logo anchor: left 40, right 122, width 82.
Screenshot `overflow-1024.png` (1024x768 viewport): logo "Dorika", nav Shop / Custom Art / Our Story / Contact, and right-side icons (search, theme, account, wishlist, cart) are all fully inside the viewport — **not cut off**.

## 6. Artifact

`D:\Code\docs C\html\Dorika\web\dorika\dorika\_qa\overflow-1024.png` — 1024x768 viewport PNG, 354,393 bytes, exists on disk.
Probe script used for the element scan: `overflow-probe.js` (in same folder).
