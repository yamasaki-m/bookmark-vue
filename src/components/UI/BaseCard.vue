<template>
  <div class="base-card" :class="padding">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    padding: { type: String, required: false },
  },
};
</script>

<style scoped lang="scss">
.base-card {
  border: 1px solid var(--border-gray);
  border-radius: 8px;
  background: var(--color-white);

  &.lg {
    padding: var(--space-32);
  }

  &.md {
    padding: var(--space-20);
  }
}
</style>
