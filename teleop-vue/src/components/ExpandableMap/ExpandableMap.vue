<template>
  <div
    class="widget"
    v-bind:class="{ big: isExpanded, small: !isExpanded }"
    :style="mapTranslate"
  >
    <div class="header" id="map-header">
      <div class="title">Map</div>
      <button
        class="icon-button right expand-button-icon"
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
      v-bind:class="{
        pointer: isExpanded && !selectingLabelPosition,
        crosshair: isExpanded && selectingLabelPosition,
      }"
    >
      <popup
        ref="labelCreationPopup"
        class="popup"
        :okEnabled="!labelNameIsEmpty"
        :shown="showPopup"
        :cancelShown="!labelCreation.isShowingLabelInfo"
        @ok="createLabel"
        @cancel="cancelLabel"
      >
        <h2 v-show="labelCreation.isCreatingLabelInfo">Creating new label</h2>
        <h2 v-show="labelCreation.isEditingLabelInfo">Editing label</h2>
        <h2 v-show="labelCreation.isShowingLabelInfo">Label informations</h2>
        <div class="popup-content">
          <ul class="popup-list">
            <li class="popup-list-row">
              <label class="popup-list-cell" for="labelName">Name : </label>
              <input
                id="labelName"
                name="labelName"
                ref="labelName"
                type="text"
                class="popup-text-field"
                required
                :readonly="labelCreation.isShowingLabelInfo"
                @input="onChangeLabelName"
                @keyup="validateLabelPopup($event, false)"
              />
            </li>
            <li class="popup-list-row">
              <label class="popup-list-cell" for="labelDesc">
                <abbr
                  v-show="!labelCreation.isShowingLabelInfo"
                  title="Optional"
                  >*</abbr
                >Description :
              </label>
              <textarea
                id="labelDesc"
                name="labelDesc"
                ref="labelDesc"
                class="popup-textarea"
                :readonly="labelCreation.isShowingLabelInfo"
                @keyup="validateLabelPopup($event, true)"
              />
            </li>
          </ul>
        </div>
      </popup>
      <video
        ref="video"
        id="map"
        class="map-video"
        autoplay
        disablePictureInPicture
        :style="videoZoomTransform"
      />
      <waypoint-overlay
        ref="wpOverlay"
        class="overlay"
        :is-active="true"
        :show="true"
        :show-grid="false"
        :list="waypoints"
        :zoom="zoom"
        :pan="pan"
        :map-size="{ width: 1000, height: 1000 }"
        :nb-of-waypoint="-1"
        :wp-color="waypointColor"
        :video-element="mapVideoElement"
        :isCreatingLabel="selectingLabelPosition"
        @newWaypoint="saveWaypoint"
        @removeWaypoint="removeWaypoint"
        @wheel="onWheel"
        @click="onClickBody"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseout="onMouseOut"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
      />
      <dropdown-menu
        v-show="isExpanded"
        class="zone float-right flex-cols fit-content"
        label="Navigation"
        align="right"
      >
        <div class="flex-cols fit-content">
          <div class="flex-rows fit-content right">
            <action-button
              label="Reset"
              class="reset-button fit-content"
              @clicked="clearWaypoints"
              :disabled="waypointsEmpty && !isRobotNavigating"
            />
            <action-button
              label="Start"
              class="fit-content"
              @clicked="startNavigation"
              :disabled="waypointsEmpty || isRobotNavigating"
            />
          </div>
          <div class="label-navigation flex-cols fit-content">
            <div class="flex-rows fit-content">
              <dropdown
                class="label-select fit-content flex-rows"
                name="label-select"
                label="Go to label: "
                ref="labelSelect"
                @changed="onChangeLabel"
                :options="labels"
                :disabled="labelsIsEmpty || isRobotNavigating"
              ></dropdown>
              <div class="flex-rows fit-content">
                <action-button
                  label="Go"
                  class="go-button fit-content"
                  @clicked="goToLabel"
                  :disabled="
                    !waypointsEmpty ||
                      currentLabelIsEmptyString ||
                      isRobotNavigating
                  "
                />
              </div>
            </div>
            <div class="flex-rows fit-content right">
              <action-button
                label="+"
                class="label-button go-button fit-content"
                @clicked="addLabel"
                :disabled="isRobotNavigating"
              />
              <action-button
                label="-"
                class="label-button go-button fit-content"
                @clicked="removeLabel"
                :disabled="currentLabelIsEmptyString || isRobotNavigating"
              />
              <action-button
                label="✎"
                class="label-button go-button fit-content"
                @clicked="editLabel"
                :disabled="currentLabelIsEmptyString || isRobotNavigating"
              />
              <action-button
                label="✥"
                class="label-button go-button fit-content"
                @clicked="moveLabel"
                :disabled="currentLabelIsEmptyString || isRobotNavigating"
              />
              <action-button
                label="&#x2139;"
                class="label-button go-button fit-content"
                @clicked="showLabel"
                :disabled="currentLabelIsEmptyString || isRobotNavigating"
              />
            </div>
          </div>
        </div>
      </dropdown-menu>
      <dropdown-menu
        v-show="isExpanded"
        class="map-color zone flex-cols fit-content"
        label="Map"
      >
        <div class="flex-rows">
          <div class="flex-cols fit-content">
            <action-button label="+" class="zoom-button" @clicked="zoomIn" />
            <action-button label="-" class="zoom-button" @clicked="zoomOut" />
          </div>
          <dropdown
            class="map-view-select flex-cols"
            name="map-view-select"
            label="Map view: "
            @changed="changeMapView"
            :options="mapViews"
          ></dropdown>
        </div>
      </dropdown-menu>
    </div>
  </div>
</template>

<script>
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

import { SvgIcon } from "@/components/SvgIcon";
import WaypointOverlay from "@/components/WaypointOverlay/WaypointOverlay.vue";
import ActionButton from "@/components/ActionButton/ActionButton.vue";
import Dropdown from "@/components/Dropdown/Dropdown.vue";
import Popup from "@/components/Popup/Popup.vue";
import DropdownMenu from "@/components/DropdownMenu/DropdownMenu.vue";

export default {
  name: "expandable-map",
  components: {
    SvgIcon,
    WaypointOverlay,
    ActionButton,
    Dropdown,
    Popup,
    DropdownMenu,
  },
  props: {
    translation: {
      type: Object,
      default() {
        return {
          x: 0,
          y: 0,
        };
      },
    },
  },
  data() {
    return {
      loopIntervalId: null,
      isExpanded: false,
      isRobotNavigating: false,
      mapVideoElement: "",
      waypoints: [],
      zoom: 1,
      isPinchGesture: false,
      initialPinchDiff: 0,
      prevZoom: null,
      isMouseDown: false,
      isMiddleMouseDown: false,
      panStartPosition: { x: 0, y: 0 },
      previousPan: { x: 0, y: 0 },
      pan: { x: 0, y: 0 },
      ctrlPressed: false,
      lastTouch: null,
      touchTimeout: null,
      preMouseDown: false,
      prematureTouchEnd: false,
      mapViews: [
        {
          value: "centered-robot",
          text: "Centered Robot",
        },
        {
          value: "static-map",
          text: "Static Map",
        },
      ],
      currentLabel: "",
      labelCreation: {
        isCreatingLabelInfo: false,
        isCreatingLabelCoordinates: false,
        isMovingLabel: false,
        isEditingLabelInfo: false,
        isShowingLabelInfo: false,
        labelNameField: "",
        labelDescField: "",
        labelCoordinates: {
          x: -1,
          y: -1,
          yaw: 0,
        },
      },
    };
  },
  computed: {
    showPopup() {
      return (
        (this.labelCreation.isCreatingLabelInfo ||
          this.labelCreation.isShowingLabelInfo ||
          this.labelCreation.isEditingLabelInfo) &&
        !this.isRobotNavigating
      );
    },
    selectingLabelPosition() {
      return (
        this.labelCreation.isCreatingLabelCoordinates ||
        this.labelCreation.isMovingLabel
      );
    },
    waypointColor() {
      if (this.selectingLabelPosition) {
        return "#d916d9";
      } else {
        return "#00d456";
      }
    },
    labelNameIsEmpty() {
      return this.labelCreation.labelNameField.length === 0;
    },
    labels() {
      return this.$store.state.localClient.openteraTeleop.labelHandling.labels;
    },
    waypointsEmpty() {
      return this.waypoints.length === 0;
    },
    labelsIsEmpty() {
      return this.labels.length === 1;
    },
    currentLabelIsEmptyString() {
      return this.currentLabel === "";
    },
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
        transform: transformation,
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
          transform: transformation,
        };
      }
      return {};
    },
    showControls() {
      return this.$store.state.localClient.openteraVideoConf.showControls;
    },
  },
  watch: {
    showPopup() {
      this.$emit("enableKeyboardControls", !this.showPopup);
    },
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
    },
    showControls() {
      if (!this.showControls) {
        this.setIsExpanded(false);
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    this.prevZoom = this.zoom;
    this.$store.state.localClient.openteraTeleop.labelHandling.changedCb = () => {
      this.$refs.labelSelect.setValue("");
    };
  },
  unmounted() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  },
  activated() {
    this.$refs.video.srcObject = this.mapClientStream;
    this.$refs.video.autoplay = true;
    this.mapVideoElement = document.getElementById("map");
  },
  methods: {
    validateLabelPopup(event, requireCtrl = false) {
      if (
        event.key === "Enter" &&
        (event.ctrlKey || event.metaKey || requireCtrl === false)
      ) {
        if (!this.labelNameIsEmpty) {
          this.$refs.labelCreationPopup.okPressed();
        }
      }
    },
    createLabel() {
      if (this.labelCreation.isCreatingLabelInfo) {
        this.labelCreation.labelDescField = this.$refs.labelDesc.value;
        this.labelCreation.isCreatingLabelInfo = false;
        this.labelCreation.isCreatingLabelCoordinates = false;
        if (this.$store.state.localClient.openteraTeleop.client) {
          this.$store.state.localClient.openteraTeleop.client.sendToAll(
            JSON.stringify({
              type: "addLabel",
              label: {
                name: this.labelCreation.labelNameField,
                description: this.labelCreation.labelDescField,
                coordinate: {
                  x: this.labelCreation.labelCoordinates.x,
                  y: this.labelCreation.labelCoordinates.y,
                  yaw: this.labelCreation.labelCoordinates.yaw,
                },
              },
            })
          );
        }
      } else if (this.labelCreation.isShowingLabelInfo) {
        this.cancelLabel();
      } else if (this.labelCreation.isEditingLabelInfo) {
        this.labelCreation.labelDescField = this.$refs.labelDesc.value;
        this.labelCreation.isEditingLabelInfo = false;
        if (this.$store.state.localClient.openteraTeleop.client) {
          this.$store.state.localClient.openteraTeleop.client.sendToAll(
            JSON.stringify({
              type: "editLabel",
              currentLabel: this.currentLabel,
              newLabel: {
                name: this.labelCreation.labelNameField,
                description: this.labelCreation.labelDescField,
                coordinate: null,
              },
            })
          );
        }
      }
    },
    confirmMoveLabel() {
      if (this.labelCreation.isMovingLabel) {
        this.labelCreation.isMovingLabel = false;
        if (this.$store.state.localClient.openteraTeleop.client) {
          this.$store.state.localClient.openteraTeleop.client.sendToAll(
            JSON.stringify({
              type: "editLabel",
              currentLabel: this.labelCreation.labelNameField,
              newLabel: {
                name: this.labelCreation.labelNameField,
                description: this.labelCreation.labelDescField,
                coordinate: {
                  x: this.labelCreation.labelCoordinates.x,
                  y: this.labelCreation.labelCoordinates.y,
                  yaw: this.labelCreation.labelCoordinates.yaw,
                },
              },
            })
          );
        }
      }
    },
    addLabel() {
      this.labelCreation.isCreatingLabelCoordinates = true;
    },
    removeLabel() {
      if (this.currentLabelIsEmptyString) {
        return;
      }

      const removedLabel = this.currentLabel;

      this.$refs.labelSelect.setValue("");
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "removeLabel",
            label: removedLabel,
          })
        );
      }
    },
    moveLabel() {
      this.labelCreation.isMovingLabel = true;
      this.labelCreation.labelNameField = this.currentLabel;
      this.labelCreation.labelDescField = this.getLabelDesc(this.currentLabel);
    },
    showLabel() {
      this.labelCreation.isShowingLabelInfo = true;
      sleep(100).then(() => {
        this.$refs.labelName.value = this.currentLabel;
        this.$refs.labelDesc.value = this.getLabelDesc(this.currentLabel);
        this.labelCreation.labelNameField = this.currentLabel;
      });
    },
    editLabel() {
      this.labelCreation.isEditingLabelInfo = true;
      sleep(100).then(() => {
        this.$refs.labelName.value = this.currentLabel;
        this.$refs.labelDesc.value = this.getLabelDesc(this.currentLabel);
      });
    },
    getLabelDesc(labelName) {
      return this.$store.state.localClient.openteraTeleop.labelHandling
        .labelsDesc[labelName];
    },
    onChangeLabel(event) {
      this.currentLabel = event.new;
    },
    onChangeLabelName(event) {
      this.labelCreation.labelNameField = event.target.value;
    },
    toggleExpand() {
      this.setIsExpanded(!this.isExpanded);
    },
    onClickBody() {
      if (!this.isExpanded && !this.ctrlPressed) {
        this.setIsExpanded(true);
      }
    },
    onClickMask() {
      if (this.isExpanded) {
        this.setIsExpanded(false);
      }
    },
    onMouseDown(event) {
      if (
        event.button === 0 &&
        this.isExpanded &&
        !this.isRobotNavigating &&
        !this.ctrlPressed
      ) {
        if (this.$refs.wpOverlay.setWaypointPosition(event)) {
          this.isMouseDown = true;
        }
      } else if (
        event.button === 1 ||
        (this.ctrlPressed && event.button === 0)
      ) {
        this.isMiddleMouseDown = true;
        this.panStartPosition = { x: event.clientX, y: event.clientY };
      }
    },
    onMouseMove(event) {
      if (this.isMouseDown) {
        this.$refs.wpOverlay.setWaypointYaw(event);
      } else if (this.isMiddleMouseDown) {
        const mousePosition = { x: event.clientX, y: event.clientY };
        this.doPan(mousePosition);
      }
    },
    onMouseUp(event) {
      if (this.isMouseDown) {
        this.$refs.wpOverlay.confirmNewWaypoint(event);
        this.isMouseDown = false;
      } else if (this.isMiddleMouseDown) {
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
        this.isMiddleMouseDown = false;
      }
    },
    onMouseOut() {
      if (this.isMouseDown) {
        this.$refs.wpOverlay.cancelNewWaypoint();
        this.isMouseDown = false;
      } else if (this.isMiddleMouseDown) {
        this.previousPan = this.pan;
        this.isMiddleMouseDown = false;
      }
    },
    onTouchStart(event) {
      if (
        event.touches.length === 1 &&
        this.isExpanded &&
        !this.isRobotNavigating
      ) {
        event.preventDefault();
        this.preMouseDown = true;
        this.lastTouch = event.touches[0];
        this.touchTimeout = setTimeout(
          function() {
            this.handleSingleTouch(event);
            this.touchTimeout = null;
            if (this.prematureTouchEnd && this.isMouseDown) {
              // If the toucheend event has been triggered before the end of the timeout
              this.prematureTouchEnd = false;
              this.$refs.wpOverlay.confirmNewWaypoint(this.lastTouch);
              this.isMouseDown = false;
            } else if (this.prematureTouchEnd && !this.isMouseDown) {
              this.prematureTouchEnd = false;
            } else {
              this.preMouseDown = false;
            }
          }.bind(this),
          50
        );
      } else if (event.touches.length === 2 && !this.isMouseDown) {
        event.preventDefault();
        this.preMouseDown = false;
        clearTimeout(this.touchTimeout);
        this.touchTimeout = null;
        this.handlePinch(event);
      }
    },
    onTouchMove(event) {
      if (this.isMouseDown) {
        event.preventDefault();
        this.$refs.wpOverlay.setWaypointYaw(event);
        this.lastTouch = event.touches[0];
      } else if (this.isPinchGesture) {
        event.preventDefault();
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
    onTouchEnd(event) {
      if (this.isExpanded && this.preMouseDown && !this.isMouseDown) {
        // If the toucheend event has been triggered before the end of the timeout
        this.preMouseDown = false;
        this.prematureTouchEnd = true;
      }
      if (this.isMouseDown) {
        this.preMouseDown = false;
        event.preventDefault();
        this.$refs.wpOverlay.confirmNewWaypoint(this.lastTouch);
        this.isMouseDown = false;
      } else if (this.isPinchGesture) {
        event.preventDefault();
        this.prevZoom = this.zoom;
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
        this.isPinchGesture = false;
      }
    },
    handleSingleTouch(event) {
      if (this.$refs.wpOverlay.setWaypointPosition(event)) {
        this.isMouseDown = true;
      }
    },
    handlePinch(event) {
      this.isPinchGesture = true;
      const p1 = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      const p2 = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      this.initialPinchDiff = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      this.panStartPosition = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
    },
    onKeyDown(event) {
      if (event.key === "Control" || event.key === "Meta") {
        this.ctrlPressed = true;
      }
    },
    cancelLabel() {
      this.labelCreation.isCreatingLabelCoordinates = false;
      this.labelCreation.isCreatingLabelInfo = false;
      this.labelCreation.isMovingLabel = false;
      this.labelCreation.isShowingLabelInfo = false;
      this.labelCreation.isEditingLabelInfo = false;
    },
    onKeyUp(event) {
      if (event.key === "Control" || event.key === "Meta") {
        this.ctrlPressed = false;
      } else if (event.key === "Escape") {
        this.$refs.labelCreationPopup.cancelPressed();
      }
    },
    doPan(position) {
      const deltaPosition = {
        x: position.x - this.panStartPosition.x,
        y: position.y - this.panStartPosition.y,
      };
      this.pan = {
        x: this.previousPan.x + deltaPosition.x,
        y: this.previousPan.y + deltaPosition.y,
      };
    },
    saveWaypoint(event) {
      if (this.selectingLabelPosition) {
        this.labelCreation.labelCoordinates = { ...event.coordinate };
        if (this.labelCreation.isCreatingLabelCoordinates) {
          this.labelCreation.isCreatingLabelCoordinates = false;
          this.labelCreation.isCreatingLabelInfo = true;
          sleep(100).then(() => {
            this.$refs.labelName.focus();
          });
        } else if (this.labelCreation.isMovingLabel) {
          this.confirmMoveLabel();
        }
      } else {
        this.waypoints.push(event);
        this.sendWaypoints([event]);
      }
    },
    clearWaypoints() {
      this.waypoints = [];
      this.cancelWaypoints();
      this.resetWaypointReached();
      this.$refs.labelSelect.setValue("");
    },
    cancelWaypoints() {
      this.isRobotNavigating = false;
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "stop", state: true })
        );
      }
    },
    changeMapView(event) {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({
            type: "changeMapView",
            new: event.new,
            old: event.old,
          })
        );
      }
    },
    startNavigation() {
      this.isRobotNavigating = true;
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "start", state: true })
        );
      }
    },
    sendWaypoints(waypoints) {
      if (this.$store.state.localClient.openteraTeleop.client) {
        this.$store.state.localClient.openteraTeleop.client.sendToAll(
          JSON.stringify({ type: "waypointArray", array: waypoints })
        );
      }
    },
    resetWaypointReached() {
      this.$store.commit("localClient/openteraTeleop/changeWaypointReached", 0);
    },
    goToLabel() {
      if (!this.currentLabelIsEmptyString) {
        this.isRobotNavigating = true;
        if (this.$store.state.localClient.openteraTeleop.client) {
          this.$store.state.localClient.openteraTeleop.client.sendToAll(
            JSON.stringify({ type: "goToLabel", label: this.currentLabel })
          );
          this.waypoints.push({
            // Random data, waypoints content is not currently used since they are not drawn anymore
            type: "label",
            label: this.currentLabel,
          });
        }
      }
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
      if (event.deltaY > 0) {
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
        if (prevMapWidth > 0 && prevMapHeight > 0) {
          this.pan.x = (this.pan.x * currMapWidth) / prevMapWidth;
          this.pan.y = (this.pan.y * currMapHeight) / prevMapHeight;
          this.previousPan.x = this.pan.x;
          this.previousPan.y = this.pan.y;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./ExpandableMap.scss";
</style>
