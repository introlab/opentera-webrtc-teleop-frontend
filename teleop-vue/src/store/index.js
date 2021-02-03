import { createStore } from "vuex";

import Links from "./modules/links";
import OpenteraStates from "./modules/openteraStates";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    links: Links,
    opentera: OpenteraStates
  }
});
