// src/store/index.ts

import { createStore } from "vuex";

import Router from "./modules/router";
import ClientStore from "./modules/clientStore";
import { RootState } from "./modules/opentera";

export default createStore<RootState>({
  state: {} as RootState,
  mutations: {},
  actions: {},
  modules: {
    router: Router,
    localClient: ClientStore,
  },
});
