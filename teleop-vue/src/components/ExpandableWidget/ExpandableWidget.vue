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
    >
      <video ref="video" id="map" class="map-video" autoplay />
      <waypoint-overlay
        v-show="isExpanded"
        class="overlay"
        :is-active="true"
        :is-clickable="true"
        :show="true"
        :show-grid="false"
        :list="waypoints"
        :zoom="1"
        :map-size="{ width: 1000, height: 1000 }"
        :nb-of-waypoint="-1"
        wp-color="#00d456"
        :video-element="mapVideoElement"
        @newWaypoint="saveWaypoint"
      />
      <div v-show="isExpanded" class="action-buttons">
        <reset-button
          @resetClicked="clearWaypoints"
          :disabled="waypointsEmpty"
        />
        <start-button
          @startClicked="sendWaypoints"
          :disabled="waypointsEmpty"
        />
        <stop-button @clicked="clearWaypoints" />
      </div>
    </div>
  </div>
  <div class="mask" v-if="isExpanded"></div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import WaypointOverlay from "@/components/WaypointOverlay/WaypointOverlay.vue";
import StopButton from "@/components/StopButton/StopButton.vue";
import StartButton from "@/components/StartButton/StartButton.vue";
import ResetButton from "@/components/ResetButton/ResetButton.vue";

export default {
  name: "expandable-widget",
  components: {
    SvgIcon,
    WaypointOverlay,
    StopButton,
    StartButton,
    ResetButton
  },
  data() {
    return {
      isExpanded: false,
      mapVideoElement: "",
      waypoints: [],
      waypointsEmpty: true
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
  mounted() {
    this.$refs.video.srcObject = this.mapClientStream;
  },
  activated() {
    this.$refs.video.srcObject = this.mapClientStream;
    this.$refs.video.autoplay = true;
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ExpandableWidget.scss";
</style>
