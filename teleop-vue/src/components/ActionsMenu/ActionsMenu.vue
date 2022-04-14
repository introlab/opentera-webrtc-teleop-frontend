<template>
  <div class="menu-container">
    <button type="button" class="actions-menu-button" @click="toggleShowMenu">
      <div>Actions</div>
    </button>
    <div
      class="menu"
      v-if="showMenu"
      v-click-away="onClickAway"
      @click="onClickAway"
    >
      <div class="menu-item" v-if="robotCaps.isMobile" @click="onDock">
        Dock
      </div>
      <div
        class="menu-item"
        v-if="!localizationMode && robotCaps.usesMap"
        @click="onLocalizationMode"
      >
        Localization mode
      </div>
      <div
        class="menu-item"
        v-if="localizationMode && robotCaps.usesMap"
        @click="onMappingMode"
      >
        Mapping mode
      </div>
      <div
        class="menu-item"
        v-if="movementMode !== 'teleop'"
        @click="setMovementMode('teleop')"
      >
        Set movement mode: Teleoperation
      </div>
      <div
        class="menu-item"
        v-if="movementMode !== 'sound'"
        @click="setMovementMode('sound')"
      >
        Set movement mode: Sound tracking
      </div>
      <div
        class="menu-item"
        v-if="movementMode !== 'face'"
        @click="setMovementMode('face')"
      >
        Set movement mode: Face tracking
      </div>
      <div
        class="menu-item"
        v-if="movementMode === 'teleop' && robotCaps.hasTtopHeadMovements"
        @click="sendMovement('do_yes')"
      >
        Head movement: Yes
      </div>
      <div
        class="menu-item"
        v-if="movementMode === 'teleop' && robotCaps.hasTtopHeadMovements"
        @click="sendMovement('do_no')"
      >
        Head movement: No
      </div>
      <div
        class="menu-item"
        v-if="movementMode === 'teleop' && robotCaps.hasTtopHeadMovements"
        @click="sendMovement('do_maybe')"
      >
        Head movement: Maybe
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "actions-menu",
  data() {
    return {
      showMenu: false,
      canShowMenu: true,
      docked: false,
      localizationMode: false,
      movementMode: "teleop",
    };
  },
  inject: ["robotCaps"],
  methods: {
    toggleShowMenu() {
      if (!this.showMenu && this.canShowMenu) {
        this.showMenu = true;
        this.canShowMenu = false;
      } else if (this.showMenu) {
        this.showMenu = false;
        this.canShowMenu = true;
      }
    },
    onClickAway() {
      this.showMenu = false;
      setTimeout(() => {
        this.canShowMenu = true;
      }, 200);
    },
    onDock() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        console.log("Sending docking command");
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
            cmd: true,
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
            cmd: true,
          })
        );
      }
    },
    setMovementMode(mode) {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.movementMode = mode;
        console.log("Setting movement mode to: ", mode);
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "action",
            action: "setMovementMode",
            cmd: mode,
          })
        );
      }
    },
    sendMovement(movement) {
      if (this.$store.state.localClient.openteraTeleop.client) {
        console.log("Sending movement command: ", movement);
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "action",
            action: "doMovement",
            cmd: movement,
          })
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ActionsMenu.scss";
</style>
