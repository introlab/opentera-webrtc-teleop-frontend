import { createApp, ref } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueClickAway from "vue3-click-away"; // Detect if a click event happened outside of an element
import FlashMessage from "@smartweb/vue-flash-message";
import Ros from "./ros/Ros";

createApp(App)
  .use(store)
  .use(router())
  .use(VueClickAway) // Makes 'v-click-away' directive usable in every component
  .use(FlashMessage, {}, ref)
  .mount("#app");
