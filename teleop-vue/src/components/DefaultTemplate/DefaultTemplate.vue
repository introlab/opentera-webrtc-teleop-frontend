/* eslint-disable prettier/prettier */
<template>
  <div class="wrapper">
    <FlashMessage style="z-index: 5;" :position="'left top'" />
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
    },

    dockingStatus() {
      return this.$store.state.localClient.openteraTeleop.dockingStatus;
    }
  },
  watch: {
    dockingStatus() {
      this.$flashMessage.show({
        status: "info",
        title: this.dockingStatus,
        message: ""
      });
    }
  },
  async beforeMount() {
    await this.$store.dispatch("localClient/start", this.client);
    console.log("START COMPLETED");
    this.$store.commit(
      "localClient/openteraTeleop/setMessageEventHandler",
      (id, name, clientData, message) => {
        const parsedMsg = JSON.parse(message);
        if (parsedMsg.type === "robotStatus") {
          this.$store.commit(
            "localClient/openteraTeleop/changeRobotStatus",
            parsedMsg.status
          );
        } else if (parsedMsg.type === "waypointReached") {
          this.$store.commit(
            "localClient/openteraTeleop/changeWaypointReached",
            parsedMsg.waypointNumber
          );
        } else if (parsedMsg.type === "docking_status") {
          this.$store.commit(
            "localClient/openteraTeleop/updateDockingStatus",
            parsedMsg.status
          );
        }
      }
    );
  },
  unmounted() {
    this.$store.dispatch("localClient/destroy");
  }
};
</script>

<style lang="scss" scoped>
@import "./DefaultTemplate.scss";
</style>
