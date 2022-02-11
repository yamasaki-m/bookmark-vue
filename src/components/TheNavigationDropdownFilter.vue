<template>
  <base-dropdown
    class="filter-dropdown"
    @click:close="$emit('toggle:dropDown')"
  >
    <p v-if="!allOptions.length" class="description">
      <span class="description__text description__text--top">
        タグがまだ、作成されていません。
      </span>
      <br />
      <span class="description__text">
        各カード上部の
        <br />
        <strong>(タグを作成)</strong> から
        <br />
        タグを作成しましょう！
      </span>
    </p>

    <form v-else class="form" @submit.prevent="filterCards">
      <ul class="options-list">
        <li
          v-for="(option, index) in allOptions"
          class="options-list__item"
          :key="index"
        >
          <input
            class="options-list__input"
            :id="option"
            :value="option"
            type="checkbox"
            v-model="checkedRefs"
          />
          <label class="options-list__label" :for="option">
            {{ option }}
          </label>
        </li>

        <li class="options-list__item">
          <input
            id="all"
            class="options-list__input"
            type="checkbox"
            value="displayAll"
            v-model="checkedRefs"
          />

          <label class="options-list__label" for="all">すべて表示</label>
        </li>
      </ul>

      <base-tooltip text="設定を適用" position="bottom">
        <base-button classes="primary circle-md" type="submit">
          <base-icon size="md">
            check
          </base-icon>
        </base-button>
      </base-tooltip>
    </form>
  </base-dropdown>
</template>

<script>
import { inject, computed } from "vue";

import useClickOutside from "../composables/useClickOutside";

export default {
  props: {
    // allOptions: { type: Array, required: true },
    // checkedOptions: { type: Array, required: true },
  },

  emits: ["submit:filterCards", "toggle:dropDown", "change:checkedOptions"],

  setup(props, { emit }) {
    const {
      filterCards,
      allOptions,
      checkedOptions,
      setCheckedOptions,
      toggleFilterDropdown,
    } = inject("useFilter");

    const checkedRefs = computed({
      get: () => checkedOptions.value,
      set: (val) => setCheckedOptions(val),
    });
    // const checkedRefs = computed({
    //   get: () => props.checkedOptions,
    //   set: (val) => emit("change:checkedOptions", val),
    // });

    // hideOnClickOutside関連
    const target = ".filter-dropdown";
    const isShow = computed(() => props.isShow);
    const handler = () => {
      emit("toggle:dropDown");
    };

    useClickOutside(target, isShow, handler);

    return {
      checkedRefs,
      filterCards,
      allOptions,
      checkedOptions,

      toggleFilterDropdown,
    };
  },
};
</script>

<style lang="scss" scoped>
.filter-dropdown {
  position: absolute;
  left: -80px;
  top: 44px;

  @include respond(tablet) {
    left: -69px;
    top: 55px;
    text-align: left;
  }
}

.description {
  max-width: 15rem;
  margin-top: var(--space-10);

  &__text {
    font-size: var(--text-sm);

    &--top {
      display: inline-block;
      margin-bottom: var(--space-6);
    }
  }
}

.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.options-list {
  width: max-content;
  margin-bottom: var(--space-10);

  &__item {
    &:last-child {
      margin-top: var(--space-6);
    }
  }

  &__input {
    display: none;

    &:checked + .options-list__label::after {
      opacity: 1;
    }
  }

  &__label {
    display: inline-block;
    position: relative;
    width: auto;
    padding: 5px 30px;
    font-size: var(--text-sm);
    cursor: pointer;

    // チェックボックス
    &::before {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 5px;
      height: 16px;
      width: 16px;
      margin-top: -8px;
      border: 1px solid var(--color-gray-400);
      border-radius: 5px;
      background: var(--color-white);
    }

    // チェックマーク
    &::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 10px;
      transform: rotate(45deg);
      opacity: 0;
      width: 5px;
      height: 9px;
      margin-top: -7px;
      border-right: 2px solid var(--color-black);
      border-bottom: 2px solid var(--color-black);
    }
  }
}
</style>
