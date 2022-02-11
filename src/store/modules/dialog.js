const state = {
  showDialog: false,

  dialog: {
    title: null,
    text: null,
    handlerOnAllow: null,
  },
};

const getters = {
  showDialog(state) {
    return state.showDialog;
  },

  dialog(state) {
    return state.dialog;
  },
};

const mutations = {
  showConfirmDialog(state, { title, text, handlerOnAllow }) {
    state.showDialog = true;

    state.dialog = { title, text, handlerOnAllow };
  },

  hideDialog(state) {
    state.showDialog = false;
  },
};

const actions = {
  showConfirmDialog({ commit }, { title, text, handlerOnAllow }) {
    commit("showConfirmDialog", { title, text, handlerOnAllow });
  },

  hideDialog({ commit }) {
    commit("hideDialog");
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
