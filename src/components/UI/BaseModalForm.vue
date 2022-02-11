<template>
  <base-card class="base-modal-form" padding="md">
    <base-button
      class="base-modal-form__close-button"
      classes="default plain-xs"
      @click="$emit('click:closeForm')"
    >
      <base-icon size="md">
        close
      </base-icon>
    </base-button>

    <h2 class="base-modal-form__title"><slot name="title"></slot></h2>

    <base-form>
      <slot name="body"></slot>
    </base-form>

    <base-button classes="primary circle-lg" @click="$emit('submit:form')">
      <base-icon size="lg">
        check
      </base-icon>
    </base-button>
  </base-card>
</template>

<script>
export default {
  emits: ["click:closeForm", "submit:form"],
};
</script>

<style scoped lang="scss">
.base-modal-form {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--space-16);

  &__close-button {
    position: absolute;
    right: 5px;
    top: 5px;
  }

  &__title {
    font-size: var(--text-md);
    line-height: 1;
    letter-spacing: 0.05em;
  }

  // &__body {
  //   display: flex;
  //   flex-direction: column;
  //   row-gap: var(--space-20);
  // }
}
</style>
