<template>
  <base-dropdown
    class="storedPeriod-dropdown"
    @click:close="$emit('close-button-click')"
  >
    <p class="storedPeriod-dropdown__title">集計期間</p>

    <div class="storedPeriod-dropdown__body">
      <div v-if="!showSelectForm">
        <div class="indicator">
          <p class="indicator__text">{{ periodLabel }}</p>

          <base-tooltip text="期間を設定">
            <base-button
              classes="default plain-xs"
              @click.stop="showSelectForm = !showSelectForm"
            >
              <base-icon size="sm">
                calendar_today
              </base-icon>
            </base-button>
          </base-tooltip>
        </div>
        <p v-if="remainingDays >= 0" class="diff">
          リセットまで
          <span class="diff__emphasis">{{ remainingDays }}</span> 日
        </p>
      </div>

      <div v-else class="select-wrapper">
        <select v-model.number="selectedPeriodLength" class="select">
          <option disabled value="">集計期間を選択</option>
          <option value="1">1ヶ月間</option>
          <option value="3">3ヶ月間</option>
          <option value="6">半年間</option>
          <option value="noSetting">設定しない</option>
        </select>

        <base-tooltip text="設定を適用" position="bottom">
          <base-button
            classes="primary circle-md"
            @click.stop="saveSelectedPeriod"
          >
            <base-icon size="md">
              check
            </base-icon>
          </base-button>
        </base-tooltip>
      </div>
    </div>
  </base-dropdown>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import useClickOutside from "../composables/useClickOutside";

export default {
  props: {
    showPeriodDropdown: { type: Boolean, required: true },
  },

  emits: ["close-button-click"],

  setup(props, { emit }) {
    const store = useStore();

    const period = computed(() => store.getters.period);
    const periodLabel = computed(() => {
      if (
        !period.value.lengthMonth ||
        period.value.lengthMonth === "noSetting"
      ) {
        return "設定なし";
      } else {
        return period.value.label;
      }
    });
    const remainingDays = computed(() => store.getters.remainingDays);

    // 集計期間登録
    const showSelectForm = ref(false);
    const selectedPeriodLength = ref("noSetting"); // v-model

    const saveSelectedPeriod = async () => {
      try {
        await store.dispatch("saveCountingPeriod", {
          selectedPeriodLength: selectedPeriodLength.value,
        });
      } catch (error) {
        console.log(error.message);
      }

      showSelectForm.value = false;
    };

    // hideOnClickOutside関連
    const target = ".storedPeriod-dropdown";
    const isShow = computed(() => {
      return props.showPeriodDropdown;
    });
    const handler = () => {
      emit("close-button-click");
    };
    useClickOutside(target, isShow, handler);

    return {
      showSelectForm,
      selectedPeriodLength,

      period,
      periodLabel,
      remainingDays,

      saveSelectedPeriod,
    };
  },
};
</script>

<style lang="scss" scoped>
.storedPeriod-dropdown {
  position: absolute;
  left: -87px;
  top: 44px;

  @include respond(tablet) {
    left: -74px;
    top: 55px;
  }

  &__title {
    margin-bottom: var(--space-6);
    font-size: var(--text-md);
  }
}

.indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 162px;
  height: 30px;
  padding: var(--space-6) var(--space-10);
  border: 1px solid var(--color-gray-400);
  border-radius: 100vh;

  &__text {
    margin-right: var(--space-6);
    font-size: var(--text-md);
  }
}

.diff {
  margin-top: var(--space-6);
  font-size: var(--text-sm);
  text-align: center;

  &__emphasis {
    font-size: var(--text-md);
    font-weight: bold;
  }
}

.select-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: var(--space-16);

  &:after {
    content: "<>";
    position: absolute;
    right: 5px;
    top: 4px;
    transform: rotate(90deg);
    padding: 0 0 2px;
    border-bottom: 1px solid var(--color-gray-400);
    color: var(--color-black);
    font: 17px "Consolas", monospace;
    pointer-events: none;
  }
}

.select {
  display: block;
  max-width: 32rem;
  padding: 0 2.4rem;
  background-color: var(--color-white);
  color: var(--color-black);
  border: 1px solid #cccccc;
  border-radius: 5px;
  font-size: var(--text-md);
  line-height: 1.75;
  word-break: normal;
  cursor: pointer;
  appearance: none;

  &::-ms-expand {
    display: none;
  }
}
</style>
