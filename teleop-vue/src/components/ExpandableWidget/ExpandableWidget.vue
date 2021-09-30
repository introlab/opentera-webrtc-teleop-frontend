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
        :nb-of-waypoint="1"
        wp-color="#00d456"
        :video-element="mapVideoElement"
        @newWaypoint="sendWaypoint"
      />
      <stop-button v-show="isExpanded" class="button-over" />
    </div>
  </div>
  <div class="mask" v-if="isExpanded"></div>
</template>

<script>
import { SvgIcon } from "@/components/SvgIcon";
import WaypointOverlay from "./WaypointOverlay.vue";
import StopButton from "@/components/StopButton/StopButton.vue"

export default {
  name: "expandable-widget",
  components: {
    SvgIcon,
    WaypointOverlay,
    StopButton
  },
  data() {
    return {
      isExpanded: false,
      mapVideoElement: "",
      waypoints: []
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
    }
  },
  watch: {
    mapClientStream(newStream) {
      this.$refs.video.srcObject = newStream;
      this.mapVideoElement = document.getElementById("map");
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
    sendWaypoint(event) {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "waypoint", waypoint: event })
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ExpandableWidget.scss";
</style>
