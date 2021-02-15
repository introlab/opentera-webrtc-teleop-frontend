import { createStore } from "vuex";

import Router from "./modules/router";

export default createStore<any>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router: Router
  }
});
