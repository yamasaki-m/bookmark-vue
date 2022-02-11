<template>
  <header class="card-list-item-header">
    <div class="tags">
      <base-button
        classes="rounded-xs secondary"
        @click="showAddtagForm"
        text="タグ作成"
        @mouseenter.self="showTooltip($event.target)"
        @mouseleave="hideTooltip"
      >
        <base-icon size="sm">sell</base-icon>
        <span class="tags__icon-text">+</span>
      </base-button>

      <ul class="tag-list">
        <li v-for="(tag, index) in tags" class="tag-list__item" :key="index">
          <span class="tag-list__tag">
            {{ tag }} |
            <base-button
              classes="default plain-xs"
              type="button"
              @click="handleDeleteTag(tag)"
              @mouseenter.self="showTooltip($event.target)"
              @mouseleave="hideTooltip"
              text="タグ削除"
            >
              <base-icon size="xs">close</base-icon>
            </base-button>
          </span>
        </li>
      </ul>
    </div>

    <div class="title">
      <div class="title__body">
        <h3 class="title__text">{{ cardTitle }}</h3>

        <base-tooltip text="タイトル編集">
          <base-button
            class="title__edit-button"
            classes="default plain-xs"
            @click="showEditCardTitleForm"
          >
            <base-icon size="lg">edit</base-icon>
          </base-button>
        </base-tooltip>
      </div>

      <base-tooltip text="カード削除">
        <base-button
          classes="circle-md secondary"
          @click="confirmDeleteCard(cardId)"
        >
          <base-icon size="md">delete</base-icon>
        </base-button>
      </base-tooltip>
    </div>
  </header>
</template>

<script>
import { inject } from "vue";

export default {
  props: {
    cardId: { type: String, required: true },
    cardIndex: { type: Number, required: true },
    cardTitle: { type: String, required: true },
    tags: { type: Array, required: true },
  },

  setup(props) {
    const { deleteCard } = inject("useCard");
    const { deleteTag } = inject("useTag");
    const { showForm } = inject("useDynamicForm");
    const { showDialog, hideDialog } = inject("useDialog");
    const { showTooltip, hideTooltip } = inject("useOverflowTooltip");

    const confirmDeleteCard = (id) => {
      showDialog({
        title: "カード消去確認",
        text: "このカードを消去しますか？",
        callback: handleDeleteCard,
      });

      async function handleDeleteCard() {
        await deleteCard(id);
        hideDialog();
      }
    };

    const handleDeleteTag = async (tag) => {
      await deleteTag({
        targetTag: tag,
        currentTags: props.tags,
        cardIndex: props.cardIndex,
      });
      hideTooltip();
    };

    const showAddtagForm = () => {
      showForm({ form: "AddTag", cardId: props.cardId });
    };

    const showEditCardTitleForm = () => {
      showForm({ form: "EditTitle", cardId: props.cardId });
    };

    return {
      confirmDeleteCard,
      handleDeleteTag,
      showEditCardTitleForm,
      showAddtagForm,
      showTooltip,
      hideTooltip,
    };
  },
};
</script>

<style scoped lang="scss">
// タグ
.tags {
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  column-gap: var(--space-6);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  &__add-button {
    margin-right: var(--space-10);
    padding: 0 0.25rem;
    border: 1px solid var(--color-gray-400);
    border-radius: 100vh;
    background: var(--color-white);
    color: var(--color-gray-600);
    font-family: inherit;
    font-size: var(--text-xs);
    transition: 0.25s var(--ease-out);

    &:hover {
      background: var(--color-black);
      color: var(--color-white);
    }
  }

  &__icon-text {
    font-size: 1.2rem;
  }
}

.tag-list {
  display: flex;
  align-items: center;
  column-gap: var(--space-4);
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  &__tag {
    display: inline-flex;
    align-items: center;
    // height: 1.5rem;
    padding: var(--space-2) var(--space-4);
    border-radius: 100vh;
    background: var(--color-gray-200);
    color: var(--color-gray-900);
    font-size: var(--text-xs);
    line-height: 1;
    cursor: pointer;
    transition: 0.25s var(--ease-out);
  }

  &__delete-button {
    padding: 0 0.05rem 0 0.1rem;
    color: var(--color-gray-400);
    transition: 0.25s var(--ease-out);

    &:hover {
      color: var(--color-gray-900);
    }
  }

  &__icon {
    &.base-icon {
      font-size: 1rem;
    }
  }

  &::-webkit-scrollbar {
    height: 4px;
  }
}

// タイトル
.title {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: var(--space-6);
  padding-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-gray-200);

  &__body {
    display: flex;
    align-items: flex-end;
    min-width: 25rem;
    margin-top: var(--space-4);
    line-height: 1;
    transition: 0.25s var(--ease-out);
    cursor: pointer;

    &:hover {
      .title__edit-button {
        opacity: 1;
        visibility: visible;
      }
    }
  }

  &__text {
    max-width: 24rem;
    color: var(--color-black);
    font-size: var(--text-lg);
    font-weight: bold;
    line-height: 1.1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__edit-button {
    &.base-button {
      opacity: 0;
      visibility: hidden;
      margin-left: var(--space-6);

      @include respond(phone) {
        opacity: 1;
        visibility: visible;
      }
    }
  }
}
</style>
