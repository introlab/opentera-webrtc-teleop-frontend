import { createStore } from "vuex";

import Links from "./modules/links";
import OpenteraStates from "./modules/openteraStates";
import ConferenceViewStates from "./modules/conferenceViewStates";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    links: Links,
    opentera: OpenteraStates,
    conferenceView: ConferenceViewStates
  }
});
