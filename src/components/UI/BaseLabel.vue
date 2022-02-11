<template>
  <div class="base-label">
    <label
      class="base-label__label"
      :class="{ invalid: isEmpty(input) || isError(input) }"
      :for="input?.name"
    >
      <slot></slot>
    </label>

    <span class="base-label__error-message">
      <span v-if="isEmpty(input)">
        {{ errorMessage.require }}
      </span>
      <span v-else-if="isError(input)">
        {{ errorMessage[input.type] }}
      </span>
    </span>
  </div>
</template>

<script>
import useValidateInputs from "../../composables/useValidateInputs";

export default {
  props: {
    input: { type: Object, required: false },
  },

  setup() {
    const { isEmpty, isError, errorMessage } = useValidateInputs();

    return {
      isEmpty,
      isError,
      errorMessage,
    };
  },
};
</script>

<style scoped lang="scss">
.base-label {
  display: flex;
  justify-content: space-between;

  &__label {
    flex: 1 1 0;
    display: inline-block;
    color: var(--color-gray-400);
    font-size: var(--text-sm);
    line-height: 1.1;

    &.invalid {
      color: var(--color-red);
    }
  }

  &__error-message {
    display: inline-block;
    font-size: var(--text-sm);
    color: var(--color-red);
    line-height: 1;
  }
}
</style>
