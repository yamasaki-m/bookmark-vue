<template>
  <nav class="navigation" id="navigation" ref="navigationRef">
    <div class="tabs">
      <router-link class="tabs__link" to="/storedCard">
        カードリスト
      </router-link>

      <router-link class="tabs__link" to="/createCard">
        カードを作成
      </router-link>
    </div>

    <ul v-if="$route.name === 'storedCard'" class="actions-list">
      <li class="actions-list__item">
        <base-tooltip
          :text="theme === 'dark' ? 'ライトモード' : 'ダークモード'"
          position="bottom"
        >
          <base-button classes="secondary circle-md" @click="toggleTheme">
            <base-icon size="md">
              <span v-text="theme === 'dark' ? 'light_mode' : 'dark_mode'" />
            </base-icon>
          </base-button>
        </base-tooltip>
        <span class="actions-list__text">モード</span>
      </li>

      <li class="actions-list__item actions-list__item--drag">
        <base-tooltip text="カード並び替え" position="bottom">
          <router-link :to="{ name: 'sortCard' }">
            <base-button classes="secondary circle-md">
              <base-icon size="md">drag_indicator</base-icon>
            </base-button>
          </router-link>
        </base-tooltip>
        <span class="actions-list__text">並び替え</span>
      </li>

      <li class="actions-list__item">
        <base-tooltip :text="'タグでフィルター'" position="bottom">
          <base-button
            class="actions-list__icon filter-dropdown"
            classes="secondary circle-md"
            @click="toggleFilterDropdown"
          >
            <base-icon size="md">sell</base-icon>
          </base-button>
        </base-tooltip>
        <span class="actions-list__text">タグで絞る</span>

        <transition>
          <the-navigation-dropdown-filter
            v-if="isShowFilterDropdown"
            @toggle:dropDown="toggleFilterDropdown"
          />
        </transition>
      </li>

      <li class="actions-list__item">
        <base-tooltip text="集計期間設定" position="bottom">
          <base-button
            v-if="!(remainingDays >= 0)"
            class="actions-list__icon period-dropdown"
            classes="secondary circle-md"
            @click.stop="showPeriodDropdown = !showPeriodDropdown"
          >
            <base-icon size="md">schedule</base-icon>
          </base-button>

          <button
            v-else
            class="actions-list__period-counter"
            @click.stop="showPeriodDropdown = !showPeriodDropdown"
          >
            {{ remainingDays }}
          </button>
        </base-tooltip>
        <span class="actions-list__text">期間設定</span>

        <transition>
          <the-navigation-dropdown-period
            v-if="showPeriodDropdown"
            :showPeriodDropdown="showPeriodDropdown"
            @close-button-click="showPeriodDropdown = false"
          />
        </transition>
      </li>

      <li class="actions-list__item">
        <base-tooltip text="ファビコン表示" position="bottom">
          <base-button classes="secondary circle-md" @click="toggleFavicon">
            <base-icon size="md">switch_right</base-icon>
          </base-button>
        </base-tooltip>
        <span class="actions-list__text">ファビコン</span>
      </li>

      <li class="actions-list__item actions-list__item--logout">
        <base-tooltip text="ログアウト" position="bottom">
          <base-button classes="secondary circle-lg" @click="confirmLogout">
            <base-icon size="lg">person</base-icon>
          </base-button>
        </base-tooltip>
        <span class="actions-list__text">ログアウト</span>
      </li>
    </ul>
  </nav>
</template>

<script>
import TheNavigationDropdownFilter from "./TheNavigationDropdownFilter.vue";
import TheNavigationDropdownPeriod from "./TheNavigationDropdownPeriod";

import { provide, ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import useAuth from "@/composables/useAuth";
import useFilter from "@/composables/useFilter";
import useHideOnScroll from "../composables/useHideOnScroll";
import useDialog from "@/composables/useDialog";

export default {
  components: {
    TheNavigationDropdownFilter,
    TheNavigationDropdownPeriod,
  },

  setup() {
    provide("useFilter", useFilter());

    const { logout } = useAuth();
    const {
      // filterCards,
      // allOptions,
      // checkedOptions,
      setCheckedOptions,
      isShowFilterDropdown,
      toggleFilterDropdown,
    } = useFilter();
    const { showDialog, hideDialog } = useDialog();

    const store = useStore();
    const router = useRouter();

    const showActions = ref(true);

    // ダークモード
    const theme = computed(() => store.getters.theme);

    const toggleTheme = async () => {
      await store.dispatch(
        "setTheme",
        theme.value === "dark" ? "ligth" : "dark"
      );
    };

    // カード並び替え
    // const isDraggable = computed(() => store.getters.isDraggable);

    // const toggleDraggable = () => {
    //   store.dispatch("toggleDraggable");

    //   store.dispatch("removeFilter"); //並び替え操作時はフィルターを解除
    // };

    // フィルター
    // const showFilterDropdown = ref(false);

    // 期間設定
    const showPeriodDropdown = ref(false);
    const remainingDays = computed(() => store.getters.remainingDays);

    // ファビコン
    const toggleFavicon = () => store.dispatch("toggleFavicon");

    // ログアウト
    const confirmLogout = () => {
      showDialog({
        title: "ログアウト確認",
        text: "ログアウトします。よろしいですか？",
        callback: handelLogout,
      });

      async function handelLogout() {
        await logout();
        hideDialog();
        router.replace("/auth");
      }
    };

    // hideOnScroll
    const navigationRef = ref(null);
    useHideOnScroll(navigationRef);

    return {
      navigationRef,

      showActions,

      theme,
      toggleTheme,

      // allOptions,
      // checkedOptions,
      setCheckedOptions,
      // filterCards,
      isShowFilterDropdown,
      toggleFilterDropdown,

      // isDraggable,
      // toggleDraggable,

      showPeriodDropdown,

      toggleFavicon,

      remainingDays,

      confirmLogout,
    };
  },
};
</script>

<style scoped lang="scss">
.navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 50%;
  z-index: 1000;
  transform: translateX(-50%);
  max-height: 6rem;
  width: 100%;
  padding: var(--space-10);
  background: var(--color-base);
  border-bottom: 1px solid var(--color-gray-200);

  transition: 0.25s var(--ease-out);

  &.hide {
    transform: translateX(-50%) translateY(-100%);
  }

  @include respond(tablet) {
    flex-direction: column;
    row-gap: var(--space-16);
    max-height: max-content;
  }
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: max-content;

  &__link {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: var(--space-6) var(--space-16);
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 100vh;
    background: var(--color-white);
    color: var(--color-gray-300);
    font-size: var(--text-md);
    font-weight: bold;
    transition: 0.25s var(--ease-out);

    &:hover {
      color: var(--color-gray-600);
    }

    &:first-child {
      margin-right: var(--space-6);
      border-radius: 100vh 0 0 100vh;
    }

    &:last-child {
      border-radius: 0 100vh 100vh 0;
    }
  }

  .router-link {
    &-active {
      border-color: currentColor;
      color: var(--color-black);
      pointer-events: none;
    }
  }
}

.actions-list {
  display: flex;
  align-items: center;
  position: absolute;
  right: 7%;

  @include respond(tablet) {
    position: initial;
    justify-content: space-around;
    column-gap: var(--space-10);
  }

  @include respond(phone) {
    column-gap: 0;
  }

  &__item {
    position: relative;

    @include respond(tablet) {
      text-align: center;
      flex: 5.5rem 1 0;

      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &:not(:last-child) {
      margin-right: var(--space-10);

      @include respond(tablet) {
        margin-right: 0;
      }
    }

    &--logout {
      margin-left: var(--space-6);

      @include respond(tablet) {
        margin-left: 0;

        .base-button.size-lg {
          // padding: 0.6rem;
          font-size: 1.8rem;
        }
      }
    }
  }

  &__icon {
    &.filter-dropdown {
      &.disabled {
        opacity: 0.4;
        pointer-events: none;
      }
    }
  }

  &__text {
    display: none;

    @include respond(tablet) {
      display: inline-block;
      font-size: 1rem;
      margin-top: var(--space-2);
    }
  }

  &__period-counter {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 3.4rem;
    height: 3.4rem;
    border: 1px solid var(--border-gray);
    border-radius: 50%;
    padding: 0.6rem;
    background: var(--color-white);
    color: var(--color-gray-400);
    font-size: var(--text-sm);
    font-weight: bold;
    transition: 0.25s var(--ease-out);
    cursor: pointer;

    &:hover {
      border-color: var(--color-black);
      background: var(--color-black);
      color: var(--color-white);
    }
  }
}
</style>
