// src/store/index.ts

import { createStore } from "vuex";

import Router from "./modules/router";
import ClientStore from "./modules/clientStore";

export default createStore<any>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router: Router,
    localClient: ClientStore,
  },
});
