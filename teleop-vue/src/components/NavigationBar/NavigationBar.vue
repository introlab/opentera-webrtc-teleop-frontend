<template>
  <div>
    <nav class="navbar bg-secondary-dark">
      <div class="container-fluid">
        <div class="navbar-brand">{{ brand }}</div>
        <button
          class="icon-button navbar-toggler"
          type="button"
          v-on:click="navToggler"
        >
          <svg-icon class="navbar-toggler-icon" icon="list"></svg-icon>
        </button>
        <div class="flex-container navbar-collapse" v-show="showNav">
          <actions-menu
            class="navbar-item margin-right-extend margin-left-extend"
          />
          <signal-strength-indicator class="navbar-item" />
          <battery-indicator class="navbar-item" />
          <action-button
            label="Stop"
            class="stop-button navbar-item"
            @clicked="onStop"
          />
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import BatteryIndicator from "../BatteryIndicator/BatteryIndicator.vue";
import SignalStrengthIndicator from "../SignalStrengthIndicator/SignalStrengthIndicator.vue";
import ActionButton from "@/components/ActionButton/ActionButton.vue";
import ActionsMenu from "@/components/ActionsMenu/ActionsMenu.vue";

export default {
  name: "navigation-bar",
  components: {
    SvgIcon,
    BatteryIndicator,
    SignalStrengthIndicator,
    ActionButton,
    ActionsMenu,
  },
  data() {
    return {
      showNav: false,
    };
  },
  props: {
    brand: {
      type: String,
      required: true,
    },
    links: {
      type: Array,
      required: true,
    },
    defaultPath: {
      type: String,
      default: "/",
    },
  },
  methods: {
    navToggler() {
      this.showNav = !this.showNav;
      if (this.showSettings && !this.showNav) this.showSettings = false;
    },
    onStop() {
      // TODO: refactor this to be reusable for the stop button in the expandable widget
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./NavigationBar.scss";
</style>
