<template>
  <div class="card-list-item-body">
    <transition-group class="link-list" name="list" tag="ul">
      <li
        v-for="(link, index) in sortedLinks"
        class="link-list__item"
        :key="link.id"
      >
        <span :ref="setCounterRef" class="link-list__counter">
          {{ link.clickCount }}
        </span>

        <a
          class="link-list__link"
          :href="link.URL"
          target="blank"
          @click.prevent="handleOpenLink(link)"
        >
          <img
            v-show="favicon.isShow"
            class="link-list__favicon"
            :src="favicon.fetchFavicon(index)"
          />

          <span class="link-list__title">{{ link.title }}</span>
        </a>

        <base-button
          class="actions__more-button"
          classes="default plain-sm"
          @click.stop="showActionsBox($event)"
          @mouseover.self="showTooltip($event.target)"
          @mouseleave="hideTooltip"
          text="リンク編集・削除"
        >
          <base-icon size="md">
            more_vert
          </base-icon>
        </base-button>

        <div class="actions">
          <div class="actions__body">
            <base-button
              classes="secondary circle-md"
              @click="confirmDeleteLink(link)"
              text="リンク削除"
              @mouseover.self="showTooltip($event.target)"
              @mouseleave="hideTooltip"
            >
              <base-icon size="md">
                delete
              </base-icon>
            </base-button>

            <base-button
              classes="secondary circle-md"
              @click="openEditLinkForm(link)"
              text="リンク編集"
              @mouseover.self="showTooltip($event.target)"
              @mouseleave="hideTooltip"
            >
              <base-icon size="md">
                edit
              </base-icon>
            </base-button>
          </div>

          <base-button
            classes="default plain-xs"
            @click.stop="hideActionsBox"
            text="閉じる"
            @mouseover.self="showTooltip($event.target)"
            @mouseleave="hideTooltip"
          >
            <base-icon size="md">
              chevron_right
            </base-icon>
          </base-button>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { ref, onMounted, watch, computed, inject } from "vue";

import useClickOutside from "../composables/useClickOutside";

export default {
  props: {
    cardId: { type: String, required: true },
    cardIndex: { type: Number, required: true },
    links: { type: Array, required: true },
    favicon: { type: Object, required: true },
  },

  emits: ["click:openLink", "click:editLink", "click:deleteLink"],

  setup(props) {
    const {
      openLink,
      deleteLink,
      setEditTargetLink,
      incrementCount,
      setCounterColor,
    } = inject("useLink");
    const { showForm } = inject("useDynamicForm");
    const { showDialog, hideDialog } = inject("useDialog");
    const { showTooltip, hideTooltip } = inject("useOverflowTooltip");

    onMounted(() => {
      setCounterColor(counterRefs);
    });

    let counterRefs = [];
    const setCounterRef = (el) => {
      if (el) {
        counterRefs.push(el);
      }
    };

    const sortedLinks = computed(() => {
      return [...props.links].sort(compareCount);

      function compareCount(a, b) {
        return b.clickCount - a.clickCount;
      }
    });

    watch(
      sortedLinks,
      async () => {
        setCounterColor(counterRefs);
      },
      { flush: "post" }
    );

    const handleOpenLink = async (link) => {
      openLink(link.url);

      // const newCount = ++link.clickCount;
      await incrementCount({
        currentCount: link.clickCount,
        // linkId: link.id,
        linkIndex: link.index,
        cardIndex: props.cardIndex,
      });

      console.log(link.clickCount);

      // setCounterColor(counterRefs);
    };

    const confirmDeleteLink = async (link) => {
      showDialog({
        title: "リンク消去確認",
        text: "このリンクを消去しますか？",
        callback: handleDeleteLink,
      });

      async function handleDeleteLink() {
        await deleteLink({
          targetLink: link,
          currentLinks: props.links,
          cardIndex: props.cardIndex,
        });
        hideDialog();
      }
    };

    const openEditLinkForm = async (link) => {
      await setEditTargetLink(link);
      await showForm({ form: "EditLink", cardId: props.cardId });
      hideActionsBox();
    };

    const showingBox = ref(null);
    const showActionsBox = (event) => {
      if (showingBox.value) {
        hideActionsBox();
      }
      showingBox.value = event.target.closest(
        ".actions__more-button"
      ).nextElementSibling;
      showingBox.value.classList.add("show");
    };

    const hideActionsBox = () => {
      // if (showingBox.value) {
      showingBox.value.classList.remove("show");
      showingBox.value = null;
      // }
    };

    useClickOutside(".actions", showingBox, hideActionsBox);

    return {
      handleOpenLink,
      confirmDeleteLink,

      openEditLinkForm,
      setEditTargetLink,

      sortedLinks,
      counterRefs,
      setCounterRef,

      showActionsBox,
      hideActionsBox,
      showingBox,

      showTooltip,
      hideTooltip,
    };
  },
};
</script>

<style scoped lang="scss">
.link-list {
  max-height: 22.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding: var(--space-6) var(--space-6) var(--space-6) 0;

  &__item {
    position: relative;
    display: flex;
    align-items: center;
    padding: var(--space-6);
    border-radius: 100vh;
    transition: 0.25s var(--ease-out);

    &:hover {
      background-color: var(--color-gray-100);

      .actions__more-button {
        opacity: 1;
      }
    }
  }

  &__counter {
    display: inline-block;
    width: 3rem;
    height: 3rem;
    line-height: 3rem;
    margin-right: var(--space-6);
    border-radius: 50%;
    background: var(--color-gray-300);
    color: var(--color-white);
    font-size: var(--text-sm);
    font-weight: bold;
    text-align: center;
    transition: 0.25s var(--ease-out);
  }

  &__link {
    display: flex;
    align-items: center;
    width: 22rem;
    color: var(--color-black);
    font-size: var(--text-md);
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: 0.25s var(--ease-out);
  }

  &__favicon {
    width: 2rem;
    height: 2rem;
    margin: 0 var(--space-6);
  }

  &__title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.actions {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  padding: var(--space-4) 0 var(--space-4) var(--space-6);
  border: 1px solid var(--color-gray-400);
  border-radius: 100vh;
  background: var(--color-white);
  line-height: 1;
  transition: all 0.25s var(--ease-out);

  &.show {
    opacity: 1;
    visibility: visible;
    pointer-events: initial;
    z-index: 10;

    .actions__more-button {
      display: none;
    }
  }

  &__body {
    display: flex;
    column-gap: var(--space-6);
  }

  &__more-button {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;

    &:hover {
      color: var(--color-gray-600);
    }

    @include respond(phone) {
      opacity: 1;
    }
  }

  &__icon {
    padding: var(--space-6);
    color: var(--color-gray-400);

    &:first-child {
      margin-right: var(--space-6);
    }
  }

  &__hide-button {
    &.base-icon {
      font-size: 1.6rem;
      font-weight: bold;
      color: var(--color-gray-400);

      &:hover {
        color: var(--color-black);
      }
    }
  }
}

::-webkit-scrollbar {
  width: 5px;
}
</style>
