# How XMLUI Islands Works

## Overview

XMLUI Islands lets you embed self-contained XMLUI mini-apps ("islands") inside any existing HTML page — without converting the whole page to XMLUI. The surrounding HTML remains plain HTML; only the designated mount points become live XMLUI applications.

## Bootstrapping (`index.ts`)

```ts
import css from "xmlui/index.css?inline";
import { startIslands } from "xmlui";

(globalThis as any).__XMLUI_STYLES__ = ((globalThis as any).__XMLUI_STYLES__ || "") + css;
startIslands();
globalThis.dispatchEvent(new CustomEvent("xmlui-styles-loaded"));
```

`index.ts` is loaded as a standard ES module by `index.html`. It:

1. Imports the XMLUI stylesheet as an inline string and stores it on `globalThis` so islands can inject the styles into their shadow DOM.
2. Calls `startIslands()`, which scans the page for `data-xmlui-src` mount-point elements and boots an independent XMLUI app in each one.
3. Fires a `xmlui-styles-loaded` custom event so any late-arriving code knows styles are ready.

## Mount Points in `index.html`

Any `<div>` with a `data-xmlui-src` attribute becomes an island mount point:

```html
<div data-xmlui-src="./bio"></div>
<div data-xmlui-src="./checkout-form"></div>
```

The attribute value is a path to a folder. XMLUI looks for a `Main.xmlui` file inside that folder and renders it as a complete XMLUI application scoped to that element.

## Island Folders

Each folder is a tiny standalone XMLUI app:

| Folder | Root file | What it renders |
|---|---|---|
| `bio/` | `bio/Main.xmlui` | A `Stack` containing a `Markdown` block and a custom `MyComp` badge |
| `checkout-form/` | `checkout-form/Main.xmlui` | A dark-themed `Card` with a `Form`, a button that opens a `ModalDialog`, and a custom `MyComp` badge |

## Shared Custom Components (`components/`)

Both islands share the `components/MyComp.xmlui` custom component. XMLUI's islands runtime resolves shared components relative to the project root, making them available to every island without duplication.

## Project Configuration (`config.json`)

The top-level `config.json` provides the project name consumed by the XMLUI toolchain:

```json
{ "name": "XMLUI Islands" }
```

## Summary of the Data Flow

```
index.html
  └── <script type="module" src="/index.ts">
        ├── injects XMLUI CSS into globalThis
        ├── startIslands() scans the DOM
        │     ├── <div data-xmlui-src="./bio">
        │     │     └── renders bio/Main.xmlui  (uses MyComp)
        │     └── <div data-xmlui-src="./checkout-form">
        │           └── renders checkout-form/Main.xmlui  (uses MyComp)
        └── fires "xmlui-styles-loaded"
```

Each island is fully isolated — it has its own XMLUI component tree, theme, and state — while the rest of `index.html` remains ordinary HTML.
