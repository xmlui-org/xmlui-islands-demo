import css from "xmlui/index.css?inline";
import { startIslands } from "xmlui";

(globalThis as any).__XMLUI_STYLES__ = ((globalThis as any).__XMLUI_STYLES__ || "") + css;
startIslands();
globalThis.dispatchEvent(new CustomEvent("xmlui-styles-loaded"));
