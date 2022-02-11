import { computed } from "vue";
import { useStore } from "vuex";

import useCheckDeviceType from "./useCheckDeviceType";
const { deviceType, checkDeviceType } = useCheckDeviceType();

let draggedCard = null;
let sortedCards = [];

export default function useDragAndDrop() {
  const store = useStore();
  // const isDraggable = computed(() => store.getters.isDraggable);
  const originalCards = computed(() => store.getters.storedCards);

  // const toggleDraggable = () => {
  //   store.dispatch("toggleDraggable");
  // };

  const dragStart = (event, index) => {
    // if (!isDraggable.value) return;

    draggedCard = originalCards.value[index];
    event.target.style.opacity = "0.4";
    event.dataTransfer.effectAllowed = "move";

    // タブレット・スマホ画面ではゴースト画像を表示しない
    checkDeviceType();
    if (deviceType.value !== "desktop") {
      const dragGhost = event.target.cloneNode(true);
      dragGhost.style.display = "none";
      event.dataTransfer.setDragImage(dragGhost, 0, 0);
    }
  };

  const dragEnter = (event, newIndex) => {
    const oldIndex = originalCards.value.findIndex(
      (card) => card.id === draggedCard.id
    );
    if (newIndex === oldIndex) return;
    // if (!isDraggable.value || newIndex === oldIndex) return;
    event.preventDefault();

    sortedCards = [...originalCards.value];
    // prettier-ignore
    [        sortedCards[newIndex],        sortedCards[oldIndex]] =
    [originalCards.value[oldIndex],originalCards.value[newIndex]];
    store.dispatch("sortCard", { sortedCards, oldIndex, newIndex });

    // 要素が画面端にある場合、自動的にスクロール
    autoScrollHandler(event);
  };

  const dragOver = (event) => {
    // if (!isDraggable.value) return;
    event.preventDefault();
    event.stopPropagation();

    event.dataTransfer.dropEffect = "move";
  };

  const dragEnd = (event) => {
    event.target.style.opacity = "1";
    draggedCard = null;
  };

  const dropCard = async () => {
    await store.dispatch("saveOrder", { sortedCards });
    sortedCards = [];
  };

  return {
    // toggleDraggable,
    // isDraggable,
    dragStart,
    dragEnter,
    dragOver,
    dragEnd,
    dropCard,
  };
}

const autoScrollHandler = (event) => {
  const clientHeigh = document.documentElement.clientHeight;
  const clientY = event.clientY;
  const clientRatio = clientY / clientHeigh;

  const isTopEdgeReached = clientRatio < 0.15;
  const isBottomEdgeReached = clientRatio > 0.85;

  if (isTopEdgeReached) {
    scrollBy({
      top: -100,
      behavior: "smooth",
    });
  } else if (isBottomEdgeReached) {
    scrollBy({
      top: 100,
      behavior: "smooth",
    });
  }
};
