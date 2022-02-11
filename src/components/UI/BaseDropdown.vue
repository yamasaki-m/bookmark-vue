<template>
  <div class="base-dropdown">
    <base-card class="base-dropdown__card" padding="md">
      <base-button
        class="base-dropdown__close-button"
        classes="default plain-xs"
        @click="$emit('click:close')"
      >
        <base-icon size="sm">close</base-icon>
      </base-button>

      <slot></slot>
    </base-card>
  </div>
</template>

<script>
export default {
  emits: ["click:close", "submit-button-click"],
};
</script>

<style lang="scss" scoped>
.base-dropdown {
  &__card {
    &.base-card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: max-content;
      border: 1px solid var(--color-gray-400);
    }

    // 吹き出し装飾
    &:before {
      content: "";
      position: absolute;
      top: -6px;
      left: 50%;
      width: 1rem;
      height: 1rem;
      background: var(--color-white);
      transform: translateX(-50%) rotate(45deg);
      border-top: 1px solid var(--color-gray-400);
      border-left: 1px solid var(--color-gray-400);
    }
  }

  &__close-button {
    &.base-button {
      position: absolute;
      right: 5px;
      top: 5px;
    }
  }
}
</style>
