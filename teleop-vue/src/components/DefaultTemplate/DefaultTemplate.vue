/* eslint-disable prettier/prettier */
<template>
  <div class="wrapper">
    <header class="header">
      <navigation-bar
        v-bind:brand="brand"
        v-bind:defaultPath="defaultPath"
        v-bind:links="links"
      >
      </navigation-bar>
    </header>
    <main class="main bg-primary-dark">
      <router-view v-slot="{ Component }">
        <keep-alive v-bind:include="/.*-view$/">
          <component v-bind:is="Component" />
        </keep-alive>
      </router-view>
    </main>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { BusyException } from "@/store/modules/opentera";

import { NavigationBar } from "@/components/NavigationBar";

export default {
  name: "default-template",
  components: {
    NavigationBar
  },
  props: {
    brand: String,
    route: String,
    client: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters(["router/getSubRoutes"]),

    links() {
      return this["router/getSubRoutes"](this.route); // see src/store/modules/router.ts
    },

    defaultPath() {
      return this.$store.state.router[this.route].defaultPath;
    }
  },
  beforeMount() {
    this.$store.dispatch("localClient/start", this.client);
  },
  unmounted() {
    this.$store.dispatch("localClient/destroy");
  }
};
</script>

<style lang="scss" scoped>
@import "./DefaultTemplate.scss";
</style>
