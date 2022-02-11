<template>
  <button class="base-button" :class="classes" :type="type">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    classes: { type: String, required: false },
    type: { type: String, required: false, default: "button" },
  },
};
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;

  line-height: 1;
  transition: 0.25s var(--ease-out);
  cursor: pointer;

  // 形状
  &.plain {
    &-md {
      padding: var(--space-8);
    }

    &-sm {
      padding: var(--space-6);
    }

    &-xs {
      padding: var(--space-1);
    }
  }

  &.rounded {
    &-md {
      @extend %base-rounded;
      min-width: 15rem;
      min-height: 4.5rem;
      padding: var(--space-10) var(--space-16);
      font-size: var(--text-md);
    }

    &-sm {
      @extend %base-rounded;
      min-width: 125px;
      min-height: 35px;
      padding: var(--space-10);
      font-size: var(--text-sm);
    }

    &-xs {
      @extend %base-rounded;
      padding: var(--space-2) var(--space-6);
    }
  }

  &.circle {
    &-lg {
      @extend %base-circle;
      padding: var(--space-10);
    }

    &-md {
      @extend %base-circle;
      padding: var(--space-8);
    }
  }

  // テーマ
  &.primary {
    background: var(--color-black);
    color: var(--color-white);
    font-weight: 600;

    &:hover {
      background: var(--color-gray-600);
    }
  }

  &.secondary {
    background: var(--color-white);
    color: var(--color-gray-400);
    box-shadow: inset 0px 0px 0px 1px var(--border-gray);

    &:hover {
      background: var(--color-black);
      color: var(--color-white);
    }
  }

  &.accent {
    background: var(--color-white);
    color: var(--color-black);
    box-shadow: inset 0px 0px 0px 2px var(--color-black);

    &:hover {
      background: var(--color-black);
      color: var(--color-white);
    }
  }

  &.tertiary {
    box-shadow: inset 0px 0px 0px 1px var(--border-gray);
    color: var(--color-gray-400);
    font-weight: 600;

    &:hover {
      box-shadow: inset 0px 0px 0px 1px currentColor;
      color: var(--color-gray-600);
    }
  }

  &.default {
    color: var(--color-gray-400);

    &:hover {
      color: var(--color-gray-600);
    }
  }
}

%base-rounded {
  border-radius: 100vh;
}

%base-circle {
  border-radius: 50%;
}
</style>
