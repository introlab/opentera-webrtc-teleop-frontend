<template>
  <div
    class="widget"
    v-bind:class="{ big: isExpanded, small: !isExpanded }"
    :style="mapTranslate"
  >
    <div class="header" id="map-header">
      <div class="title">Map</div>
      <button
        class="icon-button left expand-button-icon"
        type="button"
        @click="toggleExpand"
      >
        <svg-icon v-show="isExpanded" icon="minimize"></svg-icon>
        <svg-icon v-show="!isExpanded" icon="expand"></svg-icon>
      </button>
    </div>
    <div
      class="body"
      id="mapBody"
      v-bind:class="{ pointer: isExpanded }"
      @wheel="onWheel"
      @click="onClickBody"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseout="onMouseOut"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
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
        :is-navigating="isRobotNavigating"
        :show="true"
        :show-grid="false"
        :list="waypoints"
        :zoom="zoom"
        :pan="pan"
        :map-size="{ width: 1000, height: 1000 }"
        :nb-of-waypoint="-1"
        wp-color="#00d456"
        :video-element="mapVideoElement"
        @newWaypoint="saveWaypoint"
        @removeWaypoint="removeWaypoint"
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
  <div class="mask" v-if="isExpanded" @click="onClickMask"></div>
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
  props: {
    translation: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0
        };
      }
    }
  },
  data() {
    return {
      loopIntervalId: null,
      isExpanded: false,
      isRobotNavigating: false,
      mapVideoElement: "",
      waypoints: [],
      waypointsEmpty: true,
      zoom: 1,
      isPinchGesture: false,
      initialPinchDiff: 0,
      prevZoom: null,
      isMiddleMouseDown: false,
      panStartPosition: { x: 0, y: 0 },
      previousPan: { x: 0, y: 0 },
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
      const transformation = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.zoom})`;
      return {
        "-moz-transform": transformation,
        "-webkit-transform": transformation,
        "-o-transform": transformation,
        "-ms-transform": transformation,
        transform: transformation
      };
    },
    mapTranslate() {
      if (!this.isExpanded) {
        const transformation = `translate(${this.translation.x}vw, ${this.translation.y}vh)`;
        return {
          "-moz-transform": transformation,
          "-webkit-transform": transformation,
          "-o-transform": transformation,
          "-ms-transform": transformation,
          transform: transformation
        };
      }
      return {};
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
    this.setIsExpanded(false);
    this.prevZoom = this.zoom;
  },
  activated() {
    this.$refs.video.srcObject = this.mapClientStream;
    this.$refs.video.autoplay = true;
    this.mapVideoElement = document.getElementById("map");
  },
  methods: {
    toggleExpand() {
      this.setIsExpanded(!this.isExpanded);
    },
    onClickBody() {
      if (!this.isExpanded) {
        this.setIsExpanded(true);
      }
    },
    onClickMask() {
      if (this.isExpanded) {
        this.setIsExpanded(false);
      }
    },
    onMouseDown(event) {
      if (event.button === 1) {
        this.isMiddleMouseDown = true;
        this.panStartPosition = { x: event.clientX, y: event.clientY };
      }
    },
    onMouseMove(event) {
      if (this.isMiddleMouseDown) {
        const mousePosition = { x: event.clientX, y: event.clientY };
        this.doPan(mousePosition);
      }
    },
    onMouseUp() {
      if (this.isMiddleMouseDown) {
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
        this.isMiddleMouseDown = false;
      }
    },
    onMouseOut() {
      if (this.isMiddleMouseDown) {
        this.previousPan = this.pan;
        this.isMiddleMouseDown = false;
      }
    },
    onTouchStart(event) {
      if (event.touches.length == 2) {
        // Pinch zoom and pan
        this.isPinchGesture = true;
        const p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        const p2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
        this.initialPinchDiff = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        this.panStartPosition = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        event.preventDefault();
      }
    },
    onTouchMove(event) {
      if (this.isPinchGesture) {
        const p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        const p2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
        const scale =
          Math.hypot(p2.x - p1.x, p2.y - p1.y) / this.initialPinchDiff;
        const deltaZoom = scale * this.prevZoom;
        if (deltaZoom >= 1) {
          this.zoom = deltaZoom;
        } else {
          this.zoom = 1;
        }
        const centerPoint = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        this.doPan(centerPoint);
      }
    },
    onTouchEnd() {
      if (this.isPinchGesture) {
        this.prevZoom = this.zoom;
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
        this.isPinchGesture = false;
      }
    },
    doPan(position) {
      const deltaPosition = {
        x: position.x - this.panStartPosition.x,
        y: position.y - this.panStartPosition.y
      };
      this.pan = {
        x: this.previousPan.x + deltaPosition.x,
        y: this.previousPan.y + deltaPosition.y
      };
    },
    saveWaypoint(event) {
      this.waypoints.push(event);
      this.waypointsEmpty = false;
    },
    clearWaypoints() {
      this.waypoints = [];
      this.waypointsEmpty = true;
      this.cancelWaypoints();
      this.resetWaypointReached();
    },
    cancelWaypoints() {
      this.isRobotNavigating = false;
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
      }
    },
    sendWaypoints() {
      this.isRobotNavigating = true;
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
    },
    removeWaypoint(event) {
      this.waypoints.splice(event, 1);
    },
    setIsExpanded(value) {
      // Get map size before toggling the expansion.
      const mapBodyElement = document.getElementById("mapBody");
      const prevMapWidth = mapBodyElement.offsetWidth;
      const prevMapHeight = mapBodyElement.offsetHeight;
      this.isExpanded = value;
      this.$emit("expansionToggle", this.isExpanded);
      this.recalculatePan(mapBodyElement, prevMapWidth, prevMapHeight);
    },
    recalculatePan(mapBodyElement, prevMapWidth, prevMapHeight) {
      // Wait until the map expansion has been toggled in the DOM before recalculating the pan
      this.$nextTick(() => {
        const currMapWidth = mapBodyElement.offsetWidth;
        const currMapHeight = mapBodyElement.offsetHeight;
        this.pan.x = (this.pan.x * currMapWidth) / prevMapWidth;
        this.pan.y = (this.pan.y * currMapHeight) / prevMapHeight;
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ExpandableMap.scss";
</style>
