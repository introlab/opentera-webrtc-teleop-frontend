import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueClickAway from "vue3-click-away"; // Detect if a click event happened outside of an element

createApp(App)
  .use(store)
  .use(router())
  .use(VueClickAway) // Makes 'v-click-away' directive usable in every component
  .mount("#app");
