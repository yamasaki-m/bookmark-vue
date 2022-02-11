<template>
  <base-card class="card-list-item" padding="md">
    <!-- <card-list-item-header
      :card="card"
      @click:deleteCard="$emit('click:deleteCard')"
      @click:editTitle="activetedForm = 'EditTitle'"
      @click:addTag="activetedForm = 'AddTag'"
      @click:deleteTag="deleteTag"
    />
    <card-list-item-body
      :sortedLinks="sortedLinks"
      :favicon="{ isShow: showFavicon, fetchFavicon }"
      @click:openLink="openLink"
      @click:editLink="openEditLinkForm"
      @click:deleteLink="confirmDeleteLink"
    /> -->

    <!-- ▼ リンク追加ボタン ▼ -->
    <div v-show="!activetedForm" class="add-button-wrapper">
      <base-tooltip text="リンク追加">
        <base-button
          classes="accent circle-lg"
          @click="activetedForm = 'AddLink'"
        >
          <base-icon size="xl">add</base-icon>
        </base-button>
      </base-tooltip>
    </div>
    <!-- ▲ リンク追加ボタン ▲ -->

    <!-- ▼ フォーム ▼ -->
    <transition name="fade">
      <div v-if="activetedForm" class="overlay" />
    </transition>

    <div class="forms">
      <transition>
        <component
          :is="'CardListItemForm' + activatedForm"
          :card="card"
          :link="editTargetLink"
          @close-button-click="activetedForm = null"
        />
      </transition>
    </div>
    <!-- ▲ フォーム ▲ -->
  </base-card>
</template>

// 見た目オンリー

<script>
import CardListItemHeader from "./CardListItemHeader.vue";
import CardListItemBody from "./CardListItemBody.vue";
import CardListItemFormEditTitle from "./CardListItemFormEditTitle";
import CardListItemFormAddTag from "./CardListItemFormAddTag";
import CardListItemFormAddLink from "./CardListItemFormAddLink";
import CardListItemFormEditLink from "./CardListItemFormEditLink";

import { ref, computed } from "vue";
import { useStore } from "vuex";

import useDecideCounterColor from "../composables/useDecideCounterColor";

export default {
  components: {
    CardListItemHeader,
    CardListItemBody,

    CardListItemFormEditTitle,
    CardListItemFormAddTag,
    CardListItemFormAddLink,
    CardListItemFormEditLink,
  },

  props: {
    card: { type: Object, required: true },
  },

  emits: ["click:editTitle", "click:deleteCard"],

  setup(props) {
    const { decideCounterColor } = useDecideCounterColor();

    const store = useStore();
    const storedCards = computed(() => store.getters.storedCards);
    const thisCard = computed(() => props.card);
    const cardIndex = computed(() =>
      storedCards.value.findIndex((card) => card.id === thisCard.value.id)
    );

    const originalLinks = ref(thisCard.value.links);
    const sortedLinks = computed(() => {
      return [...originalLinks.value].sort(compareCount);

      function compareCount(a, b) {
        return b.clickCount - a.clickCount;
      }
    });

    const activatedForm = ref(null);

    // カード
    // const confirmDeleteCard = () => {
    //   store.dispatch("showConfirmDialog", {
    //     title: "カード消去確認",
    //     text: "このカードを消去しますか？",
    //     handlerOnAllow: deleteCard,
    //   });
    // };

    // const deleteCard = async () => {
    //   const newCards = storedCards.value.filter(
    //     (card) => card.id !== thisCard.value.id
    //   );
    //   await store.dispatch("deleteCard", {
    //     newCards,
    //   });
    //   store.dispatch("hideDialog");
    // };

    // タグ
    const tags = computed(() => thisCard.value.tags);

    const deleteTag = async ({ index }) => {
      const target = tags.value[index];
      let newTags = tags.value.filter((tag) => tag !== target);
      await store.dispatch("deleteTag", {
        index: cardIndex.value,
        newTags,
      });

      if (!store.getters.filteredCards.length) {
        store.dispatch("removeFilter");
      }
    };

    // リンク編集
    const editTargetLink = ref(null);
    const openEditLinkForm = ({ link }) => {
      activatedForm.value = "EditLink";
      editTargetLink.value = link;
    };

    const openLink = async ({ index, counterRefs }) => {
      const targetLink = { ...sortedLinks.value[index] };
      window.open(targetLink.URL, "_blank");

      let newCount = ++targetLink.clickCount;
      await store.dispatch("incrementCount", {
        cardIndex: cardIndex.value,
        linkID: targetLink.id,
        linkIndex: getIndex(index),
        newCount,
      });
      decideCounterColor(counterRefs);
    };

    const getIndex = (index) => {
      const id = sortedLinks.value[index].id;
      return originalLinks.value.findIndex((link) => link.id === id);
    };

    // リンク削除
    const confirmDeleteLink = ({ link }) => {
      store.dispatch("showConfirmDialog", {
        title: "リンク消去確認",
        text: "このリンクを消去しますか？",
        handlerOnAllow: () => deleteLink(link),
      });
    };

    const deleteLink = async (target) => {
      const newList = originalLinks.value.filter((link) => link !== target);
      await store.dispatch("deleteLink", {
        cardIndex: cardIndex.value,
        newList,
      });
      store.dispatch("hideDialog");
    };

    // ファビコン関連
    const showFavicon = computed(() => store.getters.showFavicon);

    const fetchFavicon = computed(() => {
      return function(index) {
        if (!showFavicon.value) return;
        let domain = new URL(sortedLinks.value[index].URL).hostname.toString();

        if (domain.includes("google")) {
          domain = domain.replace("google.", "");
        }
        return "http://www.google.com/s2/favicons?domain=" + domain;
      };
    });

    return {
      // confirmDeleteCard,

      activatedForm,

      // タグ
      tags,
      deleteTag,

      // リンク
      sortedLinks,
      openLink,
      openEditLinkForm,
      editTargetLink,
      confirmDeleteLink,

      // ファビコン
      showFavicon,
      fetchFavicon,
    };
  },
};
</script>

<style scoped lang="scss">
/*=======================================
	カード全体
  =======================================*/
.card-list-item {
  position: relative;
  width: 35rem;
  height: 35rem;
  transition: 0.3s var(--ease-out);
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
