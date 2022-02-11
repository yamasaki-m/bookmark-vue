<template>
  <the-navigation
    v-if="$route.name == 'storedCard' || $route.name == 'createCard'"
  />

  <router-view v-slot="{ Component }">
    <transition mode="out-in" appear>
      <keep-alive>
        <component :is="Component" :key="$route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>

  <teleport to="body">
    <base-dialog />

    <base-tooltip overflow />
  </teleport>
</template>

<script>
import TheNavigation from "./components/TheNavigation.vue";

import { useStore } from "vuex";
import useAuth from "@/composables/useAuth";

export default {
  components: { TheNavigation },

  setup() {
    const { tryAutoLogin } = useAuth();

    const store = useStore();

    // 自動ログイン
    tryAutoLogin();

    // テーマ(ダーク or ライト)読み込み
    store.dispatch("loadTheme");
  },
};
</script>
