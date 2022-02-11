<template>
  <transition-group class="card-list" name="list" tag="ul" appear>
    <li v-for="card in displayingCards" class="card-list__item" :key="card.id">
      <base-card class="card-list-item" padding="md">
        <card-list-item-header
          :cardId="card.id"
          :cardIndex="card.index"
          :cardTitle="card.title"
          :tags="card.tags"
        />
        <card-list-item-body
          :cardId="card.id"
          :cardIndex="card.index"
          :links="card.links"
          :favicon="{ isShow: showFavicon, fetchFavicon }"
        />

        <!-- ▼ リンク追加ボタン ▼ -->
        <div v-show="!openedForm || id !== card.id" class="add-button-wrapper">
          <base-tooltip text="リンク追加">
            <base-button
              classes="accent circle-lg"
              @click="showForm({ form: 'AddLink', cardId: card.id })"
            >
              <base-icon size="xl">add</base-icon>
            </base-button>
          </base-tooltip>
        </div>
        <!-- ▲ リンク追加ボタン ▲ -->

        <!-- ▼ フォーム ▼ -->
        <transition name="fade">
          <div v-if="openedForm && id === card.id" class="overlay" />
        </transition>

        <div class="forms">
          <transition>
            <component
              v-if="id === card.id"
              :is="openedForm"
              :card="card"
              :cardIndex="card.index"
              :cardTitle="card.title"
              :links="card.links"
              :tags="card.tags"
              :link="editTargetLink"
            />
          </transition>
        </div>
        <!-- ▲ フォーム ▲ -->
      </base-card>
    </li>

    <router-link :to="'createCard'" key="createCard">
      <base-card class="create-card">
        <span class="create-card__text">
          カードを作成<base-icon size="sm">add</base-icon>
        </span>
      </base-card>
    </router-link>
  </transition-group>
</template>

<script>
import CardListItemHeader from "@/components/CardListItemHeader.vue";
import CardListItemBody from "@/components/CardListItemBody.vue";
import CardListItemFormEditTitle from "./CardListItemFormEditTitle";
import CardListItemFormAddTag from "./CardListItemFormAddTag";
import CardListItemFormAddLink from "./CardListItemFormAddLink";
import CardListItemFormEditLink from "./CardListItemFormEditLink";

import { inject, computed } from "vue";
import { useStore } from "vuex";

export default {
  components: {
    CardListItemHeader,
    CardListItemBody,
    CardListItemFormEditTitle,
    CardListItemFormAddTag,
    CardListItemFormAddLink,
    CardListItemFormEditLink,
  },

  setup() {
    const { storedCards } = inject("useCard");
    const { isFiltered, filteredCards } = inject("useFilter");
    const { editTargetLink } = inject("useLink");
    const { showForm, openedForm, id } = inject("useDynamicForm");

    const displayingCards = computed(() => {
      return isFiltered.value ? filteredCards.value : storedCards.value;
    });

    const store = useStore();

    // ファビコン関連
    const showFavicon = computed(() => store.getters.showFavicon);

    const fetchFavicon = computed(() => {
      return function(index) {
        if (!showFavicon.value) return;
        let domain = new URL("http://www.google.com/").hostname.toString();
        console.log(index);
        // let domain = new URL(sortedLinks.value[index].URL).hostname.toString();

        if (domain.includes("google")) {
          domain = domain.replace("google.", "");
        }
        return "http://www.google.com/s2/favicons?domain=" + domain;
      };
    });

    return {
      displayingCards,

      showForm,
      openedForm,

      id,
      editTargetLink,

      // ファビコン
      showFavicon,
      fetchFavicon,
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

  &__item {
    &[draggable="true"] {
      cursor: move;
    }
  }
}

.card-list-item {
  position: relative;
  width: 35rem;
  height: 35rem;
  transition: 0.3s var(--ease-out);
}

.create-card {
  &.base-card {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 35rem;
    height: 35rem;
    opacity: 0.8;
    color: var(--color-black);
    transition: 0.25s var(--ease-out);

    &:hover {
      border-color: var(--color-gray-400);
      background-color: var(--color-gray-400);
      color: var(--color-white);
    }
  }

  &__text {
    display: inline-flex;
    align-items: center;
    color: currentColor;
    font-size: var(--text-md);
  }

  &__icon {
    &.base-icon {
      margin-left: var(--space-6);
      color: currentColor;
    }
  }
}

/*=======================================
	リンク追加ボタン
  =======================================*/
.add-button-wrapper {
  position: absolute;
  bottom: var(--space-10);
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: var(--space-10);
  background: var(--color-white);
  border-radius: 50%;
}

/*=======================================
	入力フォームエリア
  =======================================*/
.forms {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 336px;
  margin: var(--space-6);
}

// オーバーレイ
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
  width: 35rem;
  height: 35rem;
  border-radius: 8px;
  background: var(--overlay-light);
}
</style>
