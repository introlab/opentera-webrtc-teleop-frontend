<template>
  <div class="menu-container">
    <button
      type="button"
      class="actions-menu-button"
      @click="toggleShowMenu"
      v-click-away="onClickAway"
    >
      <div>Actions</div>
    </button>
    <div class="menu" v-if="showMenu">
      <div class="menu-item" @click="onDock">Dock</div>
      <div
        class="menu-item"
        v-if="!localizationMode"
        @click="onLocalizationMode"
      >
        Localization mode
      </div>
      <div class="menu-item" v-else @click="onMappingMode">Mapping mode</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "actions-menu",
  data() {
    return {
      showMenu: false,
      docked: false,
      localizationMode: false
    };
  },
  methods: {
    toggleShowMenu() {
      this.showMenu = !this.showMenu;
    },
    onClickAway() {
      this.showMenu = false;
    },
    onDock() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "action", action: "dock", cmd: true })
        );
      }
    },
    onLocalizationMode() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.localizationMode = true;
        console.log("Switching to localization mode");
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "action",
            action: "localizationMode",
            cmd: true
          })
        );
      }
    },
    onMappingMode() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.localizationMode = false;
        console.log("Switching to mapping mode");
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "action",
            action: "mappingMode",
            cmd: true
          })
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ActionsMenu.scss";
</style>
