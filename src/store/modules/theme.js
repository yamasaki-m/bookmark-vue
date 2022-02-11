const state = {
  theme: "light",
};

const getters = {
  theme(state) {
    return state.theme;
  },
};

const mutations = {
  setTheme(state, theme) {
    state.theme = theme;

    if (state.theme === "dark") {
      document.documentElement.setAttribute("theme-mode", "dark");
    } else {
      document.documentElement.setAttribute("theme-mode", "light");
    }

    window.matchMedia("(prefers-color-scheme: dark)").addListener((event) => {
      if (event.matches) {
        document.documentElement.setAttribute("theme-mode", "dark");
      } else {
        document.documentElement.setAttribute("theme-mode", "light");
      }
    });
  },
};

const actions = {
  loadTheme({ commit }) {
    const theme = localStorage.getItem("theme");

    commit("setTheme", theme);
  },

  setTheme({ commit }, theme) {
    commit("setTheme", theme);

    localStorage.setItem("theme", theme);
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
