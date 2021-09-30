<template>
  <div>
    <nav class="navbar bg-secondary-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" v-bind:to="defaultPath">{{
          brand
        }}</router-link>
        <button
          class="icon-button navbar-toggler"
          type="button"
          v-on:click="navToggler"
        >
          <svg-icon class="navbar-toggler-icon" icon="list"></svg-icon>
        </button>
        <div class="flex-container navbar-collapse" v-show="showNav">
          <ul ref="nav" class="navbar-nav">
            <li v-for="link in links" v-bind:key="link.name">
              <router-link class="navbar-item nav-link" v-bind:to="link">
                {{ link.meta.name }}
              </router-link>
            </li>
          </ul>
          <signal-strength-indicator class="navbar-item margin-left-extend" />
          <battery-indicator class="navbar-item" />
          <device-settings class="navbar-item device-settings" />
          <stop-button class="navbar-item" />
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import DeviceSettings from "../DeviceSettings/DeviceSettings.vue";
import BatteryIndicator from "../BatteryIndicator/BatteryIndicator.vue";
import SignalStrengthIndicator from "../SignalStrengthIndicator/SignalStrengthIndicator.vue";
import StopButton from "@/components/StopButton/StopButton.vue";

export default {
  name: "navigation-bar",
  components: {
    SvgIcon,
    DeviceSettings,
    BatteryIndicator,
    SignalStrengthIndicator,
    StopButton
  },
  data() {
    return {
      showNav: false
    };
  },
  props: {
    brand: {
      type: String,
      required: true
    },
    links: {
      type: Array,
      required: true
    },
    defaultPath: {
      type: String,
      default: "/"
    }
  },
  methods: {
    navToggler() {
      this.showNav = !this.showNav;
      if (this.showSettings && !this.showNav) this.showSettings = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./NavigationBar.scss";
</style>
