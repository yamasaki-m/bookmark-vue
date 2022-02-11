import { createRouter, createWebHistory } from "vue-router";

import UserAuth from "./views/UserAuth.vue";
import StoredCard from "./views/StoredCard.vue";
import CreateCard from "./views/CreateCard.vue";
import SortCard from "./views/SortCard.vue";

import useAuth from "@/composables/useAuth";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    { path: "/", redirect: "/storedCard" },

    {
      path: "/auth",
      name: "auth",
      component: UserAuth,
      meta: { requiresUnauth: true },
    },
    {
      path: "/storedCard",
      name: "storedCard",
      component: StoredCard,
      meta: { requiresAuth: true },
    },
    {
      path: "/createCard",
      name: "createCard",
      component: CreateCard,
      meta: { requiresAuth: true },
    },
    {
      path: "/sortCard",
      name: "sortCard",
      component: SortCard,
      meta: { requiresAuth: true },
    },

    { path: "/:notFound(.*)", component: UserAuth },
  ],
});

const { isAuthenticated, loginMode } = useAuth();

router.beforeEach((to, _, next) => {
  // ゲストログイン時はルートガードを設定しない
  if (loginMode.value === "guest") {
    next();
    return;
  }

  // ユーザーログイン時のルートガード
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next("/auth");
  } else if (to.meta.requiresUnauth && isAuthenticated.value) {
    next("/storedCard");
  } else {
    next();
  }
});

export default router;
