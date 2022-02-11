<template>
  <section>
    <div class="description" key="description">
      <p class="description__text">
        カードを
        <base-icon class="description__drag-icon">
          drag_indicator
        </base-icon>
        Drag &amp; Drop で並び替え
      </p>

      <router-link :to="{ name: 'storedCard' }">
        <base-button classes="primary rounded-md">
          並び替え完了
        </base-button>
      </router-link>
    </div>

    <sort-card-list />
  </section>
</template>

<script>
import SortCardList from "@/components/SortCardList";

export default {
  components: { SortCardList },
};
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10rem 0 var(--space-20);

  @include respond(tablet) {
    margin: 13rem 0 var(--space-20);
  }

  @include respond(phone) {
    margin: 14.4rem 0 var(--space-20);
  }

  &__text {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: var(--space-10);
    color: var(--color-black);
    font-size: var(--text-md);
  }

  &__close-button {
    display: flex;
    align-items: center;
    margin: 0 auto;
    padding: var(--space-10);
    border-radius: 100vh;
    background-color: var(--color-black);
    color: var(--color-white);
    font-size: var(--text-md);
    line-height: 1;
    transition: 0.25s var(--ease-out);
    cursor: pointer;

    &:hover {
      background-color: var(--color-gray-600);
    }
  }

  &__drag-icon {
    &.base-icon {
      color: currentColor;
      cursor: unset;
    }
  }

  &__check-icon {
    &.base-icon {
      margin-left: var(--space-6);
      padding: var(--space-6);
      border-radius: 50%;
      background-color: var(--color-white);
      color: var(--color-black);
    }
  }
}
</style>
