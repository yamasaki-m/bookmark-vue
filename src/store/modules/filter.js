const state = {
  isFiltered: false,
  checkedOptions: [],
};

const getters = {
  isFiltered(state) {
    return state.isFiltered;
  },

  checkedOptions(state) {
    return state.checkedOptions;
  },

  filteredCards(state, rootState) {
    const allCards = [...rootState.storedCards];
    const checkedOptions = [...state.checkedOptions];

    if (checkedOptions.includes("displayAll")) {
      return allCards;
    } else {
      const matchedTag = (tag) =>
        checkedOptions.some((option) => option === tag);

      const hasMatchedTagCards = allCards.filter((card) =>
        card.tags.some(matchedTag)
      );

      return hasMatchedTagCards;
    }
  },
};

const mutations = {
  filterCards(state, payload) {
    state.isFiltered = true;

    state.checkedOptions = payload.checkedOptions;
  },

  removeFilter(state) {
    state.isFiltered = false;
  },
};

const actions = {
  filterCards({ commit }, payload) {
    commit("filterCards", payload);
  },

  removeFilter({ commit }) {
    commit("removeFilter");
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
