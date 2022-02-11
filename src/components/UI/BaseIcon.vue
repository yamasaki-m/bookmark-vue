<template>
  <span class="base-icon material-icons" :class="size">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: { size: { type: String, required: false } },
};
</script>

<style lang="scss" scoped>
.base-icon {
  display: inline-block;
  color: inherit;
  line-height: 1;
  cursor: pointer;

  &.xl {
    font-size: 2.2rem;
  }

  &.lg {
    font-size: 2rem;
  }

  &.md {
    font-size: 1.8rem;
  }

  &.sm {
    font-size: 1.6rem;
  }

  &.xs {
    font-size: 1rem;
  }
}
</style>
