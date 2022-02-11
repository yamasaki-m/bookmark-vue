import { createStore } from "vuex";

import rootGetters from "./getters";
import rootMutations from "./mutations";
import rooActions from "./actions";

import authModule from "./modules/auth";
import themeModule from "./modules/theme";
import PeriodModule from "./modules/period";
import filterModule from "./modules/filter";
// import DragAndDropModule from "./modules/dragAndDrop";
import dialogModule from "./modules/dialog";
import faviconModule from "./modules/favicon";

const store = createStore({
  modules: {
    auth: authModule,
    theme: themeModule,
    period: PeriodModule,
    filter: filterModule,
    // dragAndDrop: DragAndDropModule,
    dialog: dialogModule,
    favicon: faviconModule,
  },

  state() {
    return {
      storedCards: [],
    };
  },

  getters: rootGetters,

  mutations: rootMutations,

  actions: rooActions,
});

export default store;
