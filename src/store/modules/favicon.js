const state = {
  showFavicon: false,
};

const getters = {
  showFavicon(state) {
    return state.showFavicon;
  },
};

const mutations = {
  toggleFavicon(state) {
    state.showFavicon = !state.showFavicon;
  },
};

const actions = {
  toggleFavicon({ commit }) {
    commit("toggleFavicon");
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
