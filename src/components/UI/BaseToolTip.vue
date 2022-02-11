<template>
  <span v-if="overflow" class="tooltip-text tooltip-text--overflow"></span>

  <div v-else class="tooltip-wrapper">
    <span class="tooltip-text" :class="`tooltip-text--${position}`">
      {{ text }}
    </span>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    text: { type: String, required: false },
    position: { type: String, required: false, default: "top" },
    overflow: { type: Boolean, required: false },
  },
};
</script>

<style scoped lang="scss">
.tooltip-wrapper {
  position: relative;
  line-height: 1;
  cursor: pointer;

  &:hover .tooltip-text {
    opacity: 1;
    visibility: visible;
  }
}

.tooltip-text {
  display: inline-block;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%);
  padding: 5px;
  border-radius: 3px;
  background: var(--color-black);
  color: var(--color-white);
  font-size: 1.2rem;
  line-height: 1.3;
  white-space: nowrap;
  transition: opacity 0.25s var(--ease-out);
  pointer-events: none;

  @include respond(tablet) {
    display: none;
  }

  &:before {
    content: "";
    position: absolute;
    bottom: -13px;
    left: 50%;
    margin-left: -7px;
    border: 7px solid transparent;
    border-top: 7px solid var(--color-black);
  }

  &--overflow {
    z-index: 1000;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
  }

  &--top {
    position: absolute;
    top: -35px;
    left: 50%;
  }

  &--bottom {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 12px);

    &.tooltip-text:before {
      content: "";
      position: absolute;
      bottom: auto;
      top: -13px;
      left: 50%;
      margin-left: -7px;
      border: 7px solid transparent;
      border-bottom: 7px solid var(--color-black);
    }
  }
}
</style>
