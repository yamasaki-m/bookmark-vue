<template>
  <input class="base-input" />
</template>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  padding: var(--space-6) var(--space-6);
  border-radius: 4px;
  border: 2px solid var(--color-gray-200);
  background: var(--color-white);
  color: var(--color-gray-900);
  font-family: inherit;
  font-size: var(--text-md);
  transition: border-color 0.3s;

  &:focus {
    border-bottom: 2px solid #c0c0c0;
    border: 2px solid var(--color-black);
  }
}

::v-slotted(::placeholder) {
  color: var(--color-gray-200);
}
</style>
