<template>
  <div>
    <nav class="navbar bg-secondary-dark">
      <div class="container-fluid">
        <router-link class="navbar-brand" v-bind:to="defaultPath"
          >{{ brand }}</router-link
        >
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
              <router-link class="nav-link" v-bind:to="link">
                {{ link.meta.name }}
              </router-link>
            </li>
          </ul>
          <battery-indicator class="margin-left-extend" />
          <device-settings class="navbar-button margin-left-extend" />
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import DeviceSettings from "../../components/DeviceSettings/DeviceSettings.vue";
import BatteryIndicator from "../../components/BatteryIndicator/BatteryIndicator.vue";

export default {
  name: "navigation-bar",
  components: {
    SvgIcon,
    DeviceSettings,
    BatteryIndicator
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
