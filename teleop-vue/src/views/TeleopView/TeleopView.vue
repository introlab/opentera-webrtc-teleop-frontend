<template>
  <div
    class="container-fluid bg-primary-dark"
    v-on:mousemove="showToolbar"
    @mousedown="onMouseDown"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
    @mouseout="onMouseOut"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchEnd="onTouchEnd"
  >
    <div class="fluid pad row-flexbox">
      <user-video />
      <div
        class="col-flexbox"
        :class="{ col33: isMapExpanded, col100: !isMapExpanded }"
      >
        <div
          v-if="cameraDisplayMode != 2"
          class="gutter"
          :class="{
            row50: cameraDisplayMode == 0,
            row100: cameraDisplayMode == 1
          }"
        >
          <video-participant
            id="videoconf"
            name="Front Camera"
            v-bind:stream="videoConfClientStream"
            v-bind:show-name="true"
          >
          </video-participant>
        </div>
        <div
          class="row50 gutter"
          v-if="cameraDisplayMode != 1"
          :class="{
            row50: cameraDisplayMode == 0,
            row100: cameraDisplayMode == 2
          }"
        >
          <video-participant
            id="camerax"
            name="Bottom camera"
            v-bind:stream="cameraXClientStream"
            v-bind:show-name="true"
          >
          </video-participant>
        </div>
      </div>
      <div class="col-flexbox" :class="{ col66: isMapExpanded }">
        <expandable-map
          :translation="mapTranslation"
          @expansionToggle="onExpansionToggle"
          v-show="showControls"
        />
      </div>
    </div>
    <slider
      v-on:maxSpeedChangedEvent="onMaxSpeedChanged"
      v-show="showControls"
    />
    <joystick
      :width="150"
      :height="150"
      class="telepresence-joystick"
      v-bind:absolute-max-x="scaledMaxX"
      v-bind:absolute-max-yaw="scaledMaxYaw"
      v-on:joystickPositionChange="updateCmdVel"
      v-show="showControls"
    />
    <keyboard-teleop
      v-bind:absolute-max-x="scaledMaxX"
      v-bind:absolute-max-yaw="scaledMaxYaw"
      v-bind:enabled="showControls"
      v-on:keyboardCmdEvent="updateCmdVel"
    />

    <div ref="toolbarRef" class="toolbar">
      <button-conference />
    </div>
    <transition name="participants">
      <participants-list
        v-if="showParticipants"
        v-bind:clients-in-call="clientsInCall"
        v-bind:clients-in-room="clientsInRoom"
      >
      </participants-list>
    </transition>
  </div>
  <device-settings v-if="showSettings" />
</template>

<script>
import { ref } from "vue";
import useToolbar from "@/views/ConferenceView/useToolbar";
import { VideoParticipant } from "@/components/VideoParticipant";
import { ButtonConference } from "@/components/ButtonConference";
import { ParticipantsList } from "@/components/ParticipantsList";
import { Joystick } from "@/components/Joystick";
import KeyboardTeleop from "@/components/KeyboardTeleop/KeyboardTeleop.vue";
import ExpandableMap from "@/components/ExpandableMap/ExpandableMap.vue";
import Slider from "@/components/Slider/Slider.vue";
import UserVideo from "@/components/UserVideo/UserVideo.vue";
import DeviceSettings from "@/components/DeviceSettings/DeviceSettings.vue";

export default {
  name: "teleop-view",
  data() {
    return {
      chatTextArea: null,
      cmd: { x: 0, yaw: 0 }, // Global velocity command to be sent to the robot (x: m/s, y: rad/s)
      maxX: 0.3,
      maxYaw: 0.75,
      scaledMaxX: 0.3,
      scaledMaxYaw: 0.55,
      mouseDown: false,
      clickPosition: { x: 0, y: 0 },
      prevMapTranslation: { x: 0, y: 0 },
      mapTranslation: { x: 0, y: 0 },
      isMapExpanded: false
    };
  },
  components: {
    VideoParticipant,
    ButtonConference,
    ParticipantsList,
    Joystick,
    KeyboardTeleop,
    ExpandableMap,
    Slider,
    UserVideo,
    DeviceSettings
  },
  setup() {
    const toolbarRef = ref(null);

    const { showToolbar } = useToolbar(toolbarRef);

    return {
      toolbarRef,
      showToolbar
    };
  },
  computed: {
    videoConfClientStream() {
      if (
        this.$store.state.localClient.openteraVideoConf.clientsInCall.length > 0
      ) {
        return this.$store.state.localClient.openteraVideoConf.clientsInCall[0]
          .stream;
      } else {
        return null;
      }
    },
    cameraXClientStream() {
      if (
        this.$store.state.localClient.openteraCameraX.clientsInCall.length > 0
      ) {
        return this.$store.state.localClient.openteraCameraX.clientsInCall[0]
          .stream;
      } else {
        return null;
      }
    },
    clientsInCall() {
      return this.$store.state.localClient.openteraVideoConf.clientsInCall;
    },
    clientsInRoom() {
      return this.$store.state.localClient.openteraVideoConf.clientsInRoom;
    },
    showParticipants() {
      return this.$store.state.localClient.openteraVideoConf.showParticipants;
    },
    cameraDisplayMode() {
      return this.$store.state.localClient.openteraVideoConf.cameraDisplayMode;
    },
    showControls() {
      return this.$store.state.localClient.openteraVideoConf.showControls;
    },
    showSettings() {
      console.log("Teleop: show settings value: " + this.$store.state.localClient.openteraVideoConf.showSettings);
      return this.$store.state.localClient.openteraVideoConf.showSettings;
    }
  },
  watch: {
    showControls() {
      if (!this.showControls) {
        this.isMapExpanded = false;
      }
    }
  },
  methods: {
    updateCmdVel(newCmd) {
      // Update the global velocity command with the command from the keyboard or joystick
      // TODO: prioritize one of the two sources over the other.
      this.cmd = newCmd;
      this.sendCmdVel();
    },
    sendCmdVel() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "velCmd", x: this.cmd.x, yaw: this.cmd.yaw })
        );
      }
    },
    onMouseDown(event) {
      if (
        event.target.id == "map-header" &&
        event.button === 0 &&
        !this.isMapExpanded
      ) {
        event.preventDefault();
        this.clickPosition.x = (event.clientX / window.innerWidth) * 100;
        this.clickPosition.y = (event.clientY / window.innerHeight) * 100;
        this.mouseDown = true;
      }
    },
    onMouseUp() {
      if (this.mouseDown) {
        this.prevMapTranslation.x = this.mapTranslation.x;
        this.prevMapTranslation.y = this.mapTranslation.y;
        this.mouseDown = false;
      }
    },
    onMouseMove(event) {
      if (this.mouseDown) {
        event.preventDefault();
        this.mapTranslation.x =
          this.prevMapTranslation.x +
          (event.clientX / window.innerWidth) * 100 -
          this.clickPosition.x;
        this.mapTranslation.y =
          this.prevMapTranslation.y +
          (event.clientY / window.innerHeight) * 100 -
          this.clickPosition.y;
      }
    },
    // onMouseOut() {
    //   if (this.mouseDown) {
    //     this.onMouseUp();
    //   }
    // },
    onTouchStart(event) {
      if (
        event.touches[0].target.id == "map-header" &&
        event.touches.length == 1 &&
        !this.isMapExpanded
      ) {
        event.preventDefault(); // Prevents scrolling
        this.clickPosition.x = event.touches[0].clientX;
        this.clickPosition.y = event.touches[0].clientY;
        this.clickPosition.x = (event.touches[0].clientX / window.innerWidth) * 100;
        this.clickPosition.y = (event.touches[0].clientY / window.innerHeight) * 100;
        this.mouseDown = true;
      }
    },
    onTouchMove(event) {
      if (this.mouseDown) {
        event.preventDefault();
        this.mapTranslation.x =
          this.prevMapTranslation.x +
          (event.touches[0].clientX / window.innerWidth) * 100 -
          this.clickPosition.x;
        this.mapTranslation.y =
          this.prevMapTranslation.y +
          (event.touches[0].clientY / window.innerHeight) * 100 -
          this.clickPosition.y;
      }
    },
    onTouchEnd() {
      this.onMouseUp();
    },
    onExpansionToggle(event) {
      this.isMapExpanded = event;
    },
    onMaxSpeedChanged(event) {
      this.scaledMaxX = this.maxX * event;
      this.scaledMaxYaw = this.maxYaw * event;
    }
  }
};
</script>

<style scoped>
@import "./TeleopView.scss";
</style>
