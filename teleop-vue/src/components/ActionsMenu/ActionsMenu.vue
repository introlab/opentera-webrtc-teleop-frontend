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
      <div class="menu-item" v-if="docked" @click="onUndock">Undock</div>
      <div class="menu-item" v-else @click="onDock">Dock</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "actions-menu",
  data() {
    return {
      showMenu: false,
      docked: false
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
      console.log("Sending docking action");
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "action", action: "dock", cmd: true })
        );
      }
    },
    onUndock() {
      console.log("Sending undocking action");
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "action", action: "undock", cmd: true })
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ActionsMenu.scss";
</style>
