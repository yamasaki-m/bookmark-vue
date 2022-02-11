// Drag & Drop APIの iOS/Android向けポリフィル

import { polyfill } from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";

import "mobile-drag-drop/default.css";

// iOS/Androidのとき、usePolyfill=trueになる
const usePolyfill = polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

if (usePolyfill) {
  // dragenter時に Event.preventDefault() の付与必須
  document.addEventListener("dragenter", (event) => {
    event.preventDefault();
  });
  window.addEventListener("touchmove", function() {});

  // Polyfillが有効の場合にはネイティブのイベントを無効に
  document.addEventListener(
    "dragstart",
    (event) => {
      if (!event.isTrusted) {
        return;
      }
      event.stopPropagation();
    },
    true
  );
}
