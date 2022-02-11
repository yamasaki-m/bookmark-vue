const state = {
  period: {},
};

const getters = {
  period(state) {
    return state.period;
  },

  remainingDays(state) {
    // 残り日数計算の基準を 午前0時 とするため、日付の文字列を用意
    const nowToString = new Date().toLocaleDateString();
    const endToString = new Date(state.period.end).toLocaleDateString();

    const nowDate = new Date(nowToString); // 本日   00:00:00
    const endDate = new Date(endToString); // 最終日 00:00:00

    return (endDate.getTime() - nowDate.getTime()) / (24 * 60 * 60 * 1000);
  },
};

const mutations = {
  setCountingPeriod(state, payload) {
    state.period = payload;
  },

  saveCountingPeriod(state, payload) {
    state.period = payload;
  },
};

const firebaseURL =
  "https://bookmark-vue-9e70a-default-rtdb.asia-southeast1.firebasedatabase.app";

const actions = {
  async fetchCountingPeriod({ getters, rootGetters, commit }) {
    if (getters.loginMode === "user") {
      const response = await fetch(
        `${firebaseURL}/users/${rootGetters.userId}/period.json?auth=` +
          rootGetters.token,
        { method: "GET" }
      );

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || "集計期間データを読み込めませんでした。"
        );
        throw error;
      }

      commit("setCountingPeriod", { ...responseData });
    }
  },

  async saveCountingPeriod({ rootGetters, commit }, payload) {
    const start = new Date();
    const end = new Date(
      new Date().setMonth(start.getMonth() + payload.selectedPeriodLength)
    );

    const startToMMDD = new Date(start).toLocaleDateString().slice(5); // MMDD = e.g. 11/22
    const endToMMDD = new Date(end).toLocaleDateString().slice(5);
    const label = `${startToMMDD} - ${endToMMDD}`;

    let period = {
      end,
      lengthMonth: payload.selectedPeriodLength,
      label,
    };

    if (rootGetters.loginMode === "user") {
      const response = await fetch(
        `${firebaseURL}/users/${rootGetters.userId}/period.json?auth=` +
          rootGetters.token,
        {
          method: "PUT",
          body: JSON.stringify(period),
        }
      );

      if (!response.ok) {
        const error = new Error("期間設定データを正常に送信できませんでした。");
        throw error;
      }
    }

    commit("saveCountingPeriod", period);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
