<template>
  <div class="spinner">
    <span class="spinner__bounce spinner__bounce--1"></span>
    <span class="spinner__bounce spinner__bounce--2"></span>
    <span class="spinner__bounce spinner__bounce--3"></span>
    <span class="spinner__bounce spinner__bounce--4"></span>
  </div>
</template>

<style scoped lang="scss">
.spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80px;

  &__bounce {
    width: 18px;
    height: 18px;
    border-radius: 100%;
    display: inline-block;
    animation: bouncedelay 1.4s infinite ease-in-out both;

    &--1 {
      width: 8px;
      height: 8px;
      background-color: var(--color-blue);
      animation-delay: -0.48s;
    }

    &--2 {
      width: 12px;
      height: 12px;
      background-color: var(--color-green);
      animation-delay: -0.32s;
    }

    &--3 {
      width: 16px;
      height: 16px;
      background-color: var(--color-yellow);
      animation-delay: -0.16s;
    }

    &--4 {
      width: 20px;
      height: 20px;
      background-color: var(--color-red);
    }
  }
}

@keyframes bouncedelay {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
