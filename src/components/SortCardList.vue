<template>
  <transition-group
    class="card-list"
    name="list"
    tag="ul"
    key="cardList"
    appear
  >
    <li
      v-for="(card, index) in displayingCards"
      class="card-list__item"
      :key="card.id"
    >
      <base-card
        class="panel"
        padding="md"
        draggable="true"
        @dragstart.stop.self="dragStart($event, index)"
        @dragenter="dragEnter($event, index)"
        @dragover="dragOver($event)"
        @dragend="dragEnd($event)"
        @drop.stop="dropCard($event)"
      >
        <p class="panel__title">{{ card.title }}</p></base-card
      >
    </li>
  </transition-group>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

import useDragAndDrop from "../composables/useDragAndDrop";

export default {
  setup() {
    const store = useStore();

    const originalCards = computed(() => store.getters.storedCards);
    const isFiltered = computed(() => store.getters.isFiltered);
    const filteredCards = computed(() => store.getters.filteredCards);

    const displayingCards = computed(() => {
      if (isFiltered.value) {
        return filteredCards.value;
      } else {
        return originalCards.value;
      }
    });

    const {
      dragStart,
      dragEnter,
      dragOver,
      dragEnd,
      dropCard,
    } = useDragAndDrop();

    return {
      displayingCards,

      dragStart,
      dragEnter,
      dragOver,
      dragEnd,
      dropCard,
    };
  },
};
</script>

<style lang="scss" scoped>
.card-list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 35rem);
  gap: var(--space-16);

  @include respond(tablet) {
    grid-template-columns: repeat(2, 35rem);
    justify-content: space-around;
    gap: var(--space-20);
    max-width: 80rem;
    margin: 0 auto;
  }

  @include respond(phone) {
    grid-template-columns: repeat(1, 35rem);
  }
}

.panel {
  &[draggable="true"] {
    cursor: move;
  }
  &__title {
    font-size: var(--text-md);
    font-weight: bold;
  }
}
</style>
