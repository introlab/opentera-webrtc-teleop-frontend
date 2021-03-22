// src/store/index.ts

import { createStore } from "vuex";

import Router from "./modules/router";
import { Opentera } from "./modules/opentera";

export default createStore<any>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    router: Router,
    opentera: Opentera
  }
});
