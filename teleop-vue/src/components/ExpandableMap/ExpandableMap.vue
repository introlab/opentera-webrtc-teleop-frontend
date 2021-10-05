<template>
  <div
    class="widget"
    v-bind:class="{ big: isExpanded, small: !isExpanded }"
    v-click-away="onClickAway"
  >
    <div class="header">
      <div class="title">Map</div>
      <button
        class="icon-button left expand-button-icon"
        type="button"
        v-on:click="toggleExpand"
      >
        <svg-icon v-show="isExpanded" icon="minimize"></svg-icon>
        <svg-icon v-show="!isExpanded" icon="expand"></svg-icon>
      </button>
    </div>
    <div
      class="body"
      v-on:click="onClickBody"
      v-bind:class="{ pointer: isExpanded }"
      @wheel="onWheel"
    >
      <video
        ref="video"
        id="map"
        class="map-video"
        autoplay
        :style="videoZoomTransform"
      />
      <waypoint-overlay
        class="overlay"
        :is-active="true"
        :is-clickable="isExpanded"
        :show="true"
        :show-grid="false"
        :list="waypoints"
        :zoom="zoom"
        :map-size="{ width: 1000, height: 1000 }"
        :nb-of-waypoint="-1"
        wp-color="#00d456"
        :video-element="mapVideoElement"
        @newWaypoint="saveWaypoint"
        @panEvent="onPan"
      />
      <div v-show="isExpanded" class="action-buttons">
        <action-button
          label="Reset"
          class="reset-button"
          @clicked="clearWaypoints"
          :disabled="waypointsEmpty"
        />
        <action-button
          label="Start"
          @clicked="sendWaypoints"
          :disabled="waypointsEmpty"
        />
        <action-button
          label="Stop"
          class="stop-button"
          @clicked="clearWaypoints"
        />
      </div>
      <div v-show="isExpanded" class="zoom-buttons">
        <action-button label="+" class="zoom-button" @clicked="zoomIn" />
        <action-button label="-" class="zoom-button" @clicked="zoomOut" />
      </div>
    </div>
  </div>
  <div class="mask" v-if="isExpanded"></div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import WaypointOverlay from "@/components/WaypointOverlay/WaypointOverlay.vue";
import ActionButton from "@/components/ActionButton/ActionButton.vue";

export default {
  name: "expandable-map",
  components: {
    SvgIcon,
    WaypointOverlay,
    ActionButton
  },
  data() {
    return {
      isExpanded: false,
      mapVideoElement: "",
      waypoints: [],
      waypointsEmpty: true,
      zoom: 1,
      pan: { x: 0, y: 0 }
    };
  },
  computed: {
    mapClientStream() {
      if (this.$store.state.localClient.openteraMap.clientsInCall.length > 0) {
        return this.$store.state.localClient.openteraMap.clientsInCall[0]
          .stream;
      } else {
        return null;
      }
    },
    waypointReached() {
      return this.$store.state.localClient.openteraTeleop.waypointReached;
    },
    videoZoomTransform() {
      return {
        "-moz-transform": `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`,
        "-webkit-transform": `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`,
        "-o-transform": `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`,
        "-ms-transform": `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`,
        transform: `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`
      };
    }
  },
  watch: {
    mapClientStream(newStream) {
      this.$refs.video.srcObject = newStream;
      this.mapVideoElement = document.getElementById("map");
    },
    waypointReached() {
      if (
        this.waypoints.length > 0 &&
        this.waypointReached == this.waypoints.length
      ) {
        this.clearWaypoints();
      }
    }
  },
  activated() {
    this.$refs.video.srcObject = this.mapClientStream;
    this.$refs.video.autoplay = true;
    this.mapVideoElement = document.getElementById("map");
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    onClickBody() {
      if (!this.isExpanded) {
        this.isExpanded = true;
      }
    },
    onClickAway() {
      if (this.isExpanded) {
        this.isExpanded = false;
      }
    },
    saveWaypoint(event) {
      this.waypoints.push(event);
      this.waypointsEmpty = false;
    },
    clearWaypoints() {
      console.log("Clearing waypoints");
      this.waypoints = [];
      this.waypointsEmpty = true;
      this.cancelWaypoints();
      this.resetWaypointReached();
    },
    cancelWaypoints() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
      }
    },
    sendWaypoints() {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "waypointArray", array: this.waypoints })
        );
      }
    },
    resetWaypointReached() {
      this.$store.commit("localClient/openteraTeleop/changeWaypointReached", 0);
    },
    zoomIn() {
      this.zoom += 0.5;
    },
    zoomOut() {
      if (this.zoom > 1) {
        this.zoom -= 0.5;
      }
    },
    onPan(event) {
      this.pan = event;
    },
    onWheel(event) {
      if (event.deltaY > 0){
        this.zoomOut();
      } else if (event.deltaY < 0) {
        this.zoomIn();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ExpandableMap.scss";
</style>
