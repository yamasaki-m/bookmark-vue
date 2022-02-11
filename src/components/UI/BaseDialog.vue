<template>
  <div v-if="isShow" class="overlay" @click="hideDialog" />

  <transition classes="out-in" appear>
    <dialog v-if="isShow" class="base-dialog" open>
      <header class="base-dialog__header">
        <h2>{{ dialogTitle }}</h2>
      </header>

      <div class="base-dialog__body">
        <p class="base-dialog__message">{{ dialogText }}</p>

        <menu class="base-dialog__menu">
          <base-button classes="primary rounded-sm" @click="hideDialog">
            キャンセル
          </base-button>

          <base-button classes="tertiary rounded-sm" @click="callbackFunction">
            OK
          </base-button>
        </menu>

        <!-- <input v-model.trim="doNotShowModalAgain" type="checkbox" />
          今後、このメッセージを表示しない -->
      </div>
    </dialog>
  </transition>
</template>

<script>
import useDialog from "@/composables/useDialog";

export default {
  setup() {
    const {
      isShow,
      dialogTitle,
      dialogText,
      callbackFunction,
      hideDialog,
    } = useDialog();

    return {
      isShow,
      dialogTitle,
      dialogText,
      callbackFunction,
      hideDialog,
    };
  },
};
</script>

<style scoped lang="scss">
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100vh;
  width: 100%;
  background-color: var(--overlay-dark);
}

.base-dialog {
  position: fixed;
  top: 20vh;
  left: calc(50% - 20rem);
  z-index: 1001;
  width: 40rem;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  background-color: var(--color-gray-100);
  color: var(--color-gray-900);

  @include respond(phone) {
    left: calc(50% - 17rem);
    width: 34rem;
  }

  &__header {
    padding: var(--space-16);
    background-color: var(--color-black);
    color: var(--color-white);
  }

  &__body {
    display: flex;
    flex-direction: column;
    row-gap: var(--space-14);
    padding: var(--space-16);
    font-size: var(--text-sm);
  }

  &__menu {
    display: flex;
    column-gap: var(--space-14);
    align-self: flex-start;
  }
}
</style>
