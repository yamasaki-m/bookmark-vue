<template>
  <section class="stored-card">
    <base-spinner v-if="isLoading" />
    <card-list v-else />
  </section>
</template>

<script>
import CardList from "../components/CardList.vue";

import { provide } from "vue";
import { useRouter } from "vue-router";

import useAuth from "@/composables/useAuth";
import useCard from "@/composables/useCard";
import useLink from "@/composables/useLink";
import useFilter from "@/composables/useFilter";
import useTag from "@/composables/useTag";
import useDynamicForm from "@/composables/useDynamicForm";
import useDialog from "@/composables/useDialog";
import useValidate from "@/composables/useValidateInputs";
import useOverflowTooltip from "@/composables/useOverflowTooltip";

export default {
  components: { CardList },

  beforeRouteEnter(_, _2, next) {
    next(async (vm) => {
      await vm.fetchCards(vm.loginMode);

      if (vm.isError) {
        vm.showDialog({
          title: "データロードエラー",
          text: "データを読み込めませんでした。ログアウトしますか？",
          callback: vm.handleLogout,
        });
      }
    });
  },

  setup() {
    provide("useCard", useCard());
    provide("useTag", useTag());
    provide("useLink", useLink());
    provide("useFilter", useFilter());
    provide("useDynamicForm", useDynamicForm());
    provide("useDialog", useDialog());
    provide("useValidate", useValidate());
    provide("useOverflowTooltip", useOverflowTooltip());

    const { loginMode, logout } = useAuth();
    const {
      fetchCards,
      fetchUsersCards,
      fetchSampleCards,
      isLoading,
      didFetchSample,
      isError,
    } = useCard();
    const { showDialog, hideDialog } = useDialog();

    const router = useRouter();

    const handleLogout = async () => {
      await logout();
      hideDialog();
      router.push({ name: "auth" });
    };

    return {
      loginMode,
      handleLogout,
      fetchCards,

      fetchUsersCards,
      fetchSampleCards,
      isLoading,
      didFetchSample,
      isError,

      showDialog,
    };
  },
};

// onMounted(async () => {
//   await fetchCountingPeriod();
//   checkExceedCountingPeriod();
// });

// 集計期間関連
// const fetchCountingPeriod = async () => {
//   try {
//     await store.dispatch("fetchCountingPeriod");
//   } catch (error) {
//     console.log(error.message);
//     store.dispatch("showConfirmDialog", {
//       dialogTitle: "集計期間ロードエラー",
//       dialogText: error.message,
//       handlerOnAllow: fetchCountingPeriod,
//     });
//   }
// };

// const checkExceedCountingPeriod = async () => {
//   const period = computed(() => store.getters.period);
//   const remainingDays = computed(() => store.getters.remainingDays);

//   const hasExceededPeriod = () => {
//     if (period.value.lengthPerMonth === "noSetting") return;
//     return remainingDays.value <script 0;
//   };
//   hasExceededPeriod() && confirmResetClickCount();
// };

// const confirmResetClickCount = () => {
//   const resetClickCount = async () => {
//     // await store.dispatch("resetClickCount");
//     // saveCountingPeriod(period.value.pickedPeriod);

//     console.log("over");
//     await store.dispatch("hideDialog");
//   };

//   store.dispatch("showConfirmDialog", {
//     title: "カウントリセット確認",
//     text:
//       "設定した集計期間を経過したため、リンクの閲覧カウントをリセットします。よろしいですか？",
//     handlerOnAllow: resetClickCount,
//   });
// };
</script>

<style lang="scss" scoped>
.stored-card {
  min-height: calc(100vh - 14.8rem);
  // 14.8 = 9(margin-top) + 2.8(margin-bottom) + 3(page移動時のアニメーション translateY)
  margin: 9rem var(--space-6) var(--space-28);

  @include respond(tablet) {
    margin: 14.4rem 0 var(--space-28);
  }

  @include respond(phone) {
    margin: 14.4rem var(--space-10) 4rem;
  }
}
</style>
