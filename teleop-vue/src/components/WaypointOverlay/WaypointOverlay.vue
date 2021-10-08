<template>
  <canvas
    ref="canvas"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseout="onMouseOut"
    @mouseover="showOverlay = true"
  />
</template>

<script>
/**
 * source: https://github.com/introlab/securbot/blob/dev/frontend/src/components/generic/WaypointOverlay.vue
 *
 * An overlay component for the videobox component that allows an operator to click the video to
 * add a waypoint while also drawing all the waypoints from a list given as a prop.
 *
 * NOTE: This component do not add waypoints into the prop list to assure compatibility with Vuex's
 * state behavior. Instead, the component draws the prop list as waypoint plus a local waypoint
 * that gets its coordinates from an operator click (otherwise is it not drawn). If the operator
 * click was deemed valid, the local waypoint is then emitted through a component event and is the
 * parent component responsability to add to the waypoint prop list.
 *
 * @displayName Waypoint Overlay
 * @since 0.2.2
 * @version 1.0.0
 */
export default {
  name: "waypoint-overlay",
  props: {
    isActive: {
      type: Boolean,
      default: true
    },
    isClickable: {
      type: Boolean,
      default: true
    },
    isNavigating: {
      type: Boolean,
      deault: false
    },
    wpColor: {
      type: String,
      default: "#00FF00"
    },
    show: {
      type: Boolean,
      default: true
    },
    showGrid: {
      type: Boolean,
      default: false
    },
    zoom: {
      type: Number,
      default: 1
    },
    mapSize: {
      type: Object,
      default() {
        return {
          width: 1000,
          height: 1000
        };
      }
    },
    list: {
      type: Array,
      required: true
    },
    nbOfWaypoint: {
      type: Number,
      default: -1
    },
    videoElement: {
      type: [String, HTMLVideoElement],
      default: null
    },
    refreshRate: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      canvas: null,
      context: null,
      currentWaypoint: {
        coordinate: {
          x: -1,
          y: -1,
          yaw: 0
        },
        label: "",
        holdTimeS: 0
      },
      isMouseDown: false,
      isMiddleMouseDown: false,
      loopIntervalId: null,
      showOverlay: false,
      wpRadius: 0,
      middleMouseStartPosition: {
        x: 0,
        y: 0
      },
      middleMouseDeltaPosition: {
        x: 0,
        y: 0
      },
      previousPan: {
        x: 0,
        y: 0
      },
      pan: {
        x: 0,
        y: 0
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvas;
      this.context = this.canvas.getContext("2d");
      this.init();
    });
  },
  unmounted() {
    clearInterval(this.loopIntervalId);
  },
  methods: {
    /**
     * Initializes the Patrol map overlay.
     *
     * @public
     */
    init() {
      this.loopIntervalId = setInterval(() => {
        if (this.videoElement && this.isActive) {
          this.adjustCanvasToVideo();
          this.drawCanvas();
        }
      }, 1000 / this.refreshRate);
      if (this.videoElement) {
        this.drawWaypointList();
      }
    },
    /**
     * Draws the canvas.
     *
     * @public
     */
    drawCanvas() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.showGrid) {
        this.drawGrid();
      }
      if (this.show) {
        this.drawWaypointList();
      }
    },
    drawGrid() {
      const h = this.canvas.width / 10;
      const c = this.canvas.height / 10;
      this.context.lineWidth = 1;
      this.context.strokeStyle = "gray";

      for (let i = 0; i < 10; i++) {
        this.context.beginPath();
        this.context.moveTo(h * i, 1);
        this.context.lineTo(h * i, this.canvas.height - 1);
        this.context.stroke();
      }
      for (let i = 0; i < 10; i++) {
        this.context.beginPath();
        this.context.moveTo(1, c * i);
        this.context.lineTo(this.canvas.width - 1, c * i);
        this.context.stroke();
      }
    },
    /**
     * Draws the points and arrows of each waypoint in the list.
     *
     * @public
     */
    drawWaypointList() {
      if (this.nbOfWaypoint >= 0) {
        for (let i = 0; i < this.nbOfWaypoint && i < this.list.length; i++) {
          this.drawWaypoint(this.list[i]);
          this.drawYawArrow(this.list[i]);
        }
      } else {
        for (const [index, wp] of this.list.entries()) {
          this.drawWaypoint(wp);
          this.drawYawArrow(wp);
          this.writeWaypointInfos(wp, index);
        }
      }
      if (this.isMouseDown) {
        this.drawWaypoint(this.currentWaypoint);
        this.drawYawArrow(this.currentWaypoint);
      }
    },
    writeWaypointInfos(wp, index) {
      const wpCoord = wp.coordinate;
      const coord = this.getCanvasCoordinatesFromVideo(wpCoord.x, wpCoord.y);

      const text = `${index + 1}${wp.label ? `. ${wp.label}` : ""}`;

      this.context.font = "15px serif";
      this.context.fillStyle = "#000000";
      this.context.fillText(text, coord.x + 8, coord.y + 8);
    },
    /**
     * Draws a the point/dot.
     *
     * @param {Waypoint} wp The waypoint object.
     * @param {Number} index The index of the waypoint in the list (Is written next to the dot).
     * @public
     */
    drawWaypoint(wp) {
      const wpCoord = wp.coordinate;
      const { wpColor } = this;
      const coord = this.getCanvasCoordinatesFromVideo(wpCoord.x, wpCoord.y);

      this.wpRadius = Math.min(this.canvas.width, this.canvas.height) / 75;
      this.context.beginPath();
      this.context.arc(coord.x, coord.y, this.wpRadius, 0, 2 * Math.PI);
      this.context.fillStyle = wpColor;
      this.context.fill();
    },
    /**
     * Draws the arrows.
     *
     * @param {Waypoint} wp The waypoint object.
     * @public
     */
    drawYawArrow(wp) {
      const wpCoord = wp.coordinate;
      const { wpColor } = this;
      const coord = this.getCanvasCoordinatesFromVideo(wpCoord.x, wpCoord.y);

      const arrowLength = Math.min(this.canvas.width, this.canvas.height) / 15;
      const headLength = arrowLength / 4;
      const radYaw = (-wpCoord.yaw / 180) * Math.PI;
      const arrowEnd = {
        x: coord.x + arrowLength * Math.cos(radYaw),
        y: coord.y + arrowLength * Math.sin(radYaw)
      };
      const arrowTip1 = {
        x: arrowEnd.x - headLength * Math.cos(radYaw - Math.PI / 4),
        y: arrowEnd.y - headLength * Math.sin(radYaw - Math.PI / 4)
      };
      const arrowTip2 = {
        x: arrowEnd.x - headLength * Math.cos(radYaw + Math.PI / 4),
        y: arrowEnd.y - headLength * Math.sin(radYaw + Math.PI / 4)
      };

      this.context.lineCap = "round";
      this.context.lineWidth = Math.max(1, arrowLength / 10);
      this.context.strokeStyle = wpColor;

      this.context.beginPath();
      this.context.moveTo(coord.x, coord.y);
      this.context.lineTo(arrowEnd.x, arrowEnd.y);
      this.context.stroke();

      this.context.beginPath();
      this.context.moveTo(arrowEnd.x, arrowEnd.y);
      this.context.lineTo(arrowTip1.x, arrowTip1.y);
      this.context.stroke();

      this.context.beginPath();
      this.context.moveTo(arrowEnd.x, arrowEnd.y);
      this.context.lineTo(arrowTip2.x, arrowTip2.y);
      this.context.stroke();
    },
    /**
     * Gets the coordinates of the operator click.
     *
     * @param {Event} event The mouse event to extract data from.
     * @public
     */
    getVideoCoordinatesOfEvent(event) {
      const offsetAndScale = this.getVideoOffsetAndScale();
      const rect = this.canvas.getBoundingClientRect();
      const mapAdjustment = {
        width: this.mapSize.width / this.videoElement.videoWidth,
        height: this.mapSize.height / this.videoElement.videoHeight
      };
      const x =
        (event.clientX - rect.left - offsetAndScale.offsetX) /
        offsetAndScale.scale;
      const y =
        (event.clientY - rect.top - offsetAndScale.offsetY) /
        offsetAndScale.scale;
      return {
        x: x * mapAdjustment.width,
        y: y * mapAdjustment.height
      };
    },
    /**
     * Converts video/map coordinates to canvas coordinates.
     *
     * @param {Number} x The value of the x coordinate.
     * @param {Number} y The value of the y coordinate.
     * @public
     */
    getCanvasCoordinatesFromVideo(x, y) {
      const offsetAndScale = this.getVideoOffsetAndScale();
      const mapAdjustment = {
        width: this.mapSize.width / this.videoElement.videoWidth,
        height: this.mapSize.height / this.videoElement.videoHeight
      };

      return {
        x:
          (x / mapAdjustment.width) * offsetAndScale.scale +
          offsetAndScale.offsetX,
        y:
          (y / mapAdjustment.height) * offsetAndScale.scale +
          offsetAndScale.offsetY
      };
    },
    /**
     * Adjusts the canvas to the video size.
     *
     * @public
     */
    adjustCanvasToVideo() {
      this.canvas.width = this.videoElement.offsetWidth;
      this.canvas.height = this.videoElement.offsetHeight;
    },
    /**
     * Gets the offset and scale difference between the video and the canvas.
     *
     * @public
     */
    getVideoOffsetAndScale() {
      const videoRatio =
        this.videoElement.videoWidth / this.videoElement.videoHeight;
      const scale =
        (this.videoElement.offsetWidth / this.videoElement.offsetHeight <
        videoRatio
          ? this.videoElement.offsetWidth / this.videoElement.videoWidth
          : this.videoElement.offsetHeight / this.videoElement.videoHeight) *
        this.zoom;

      const offsetY =
        (this.videoElement.offsetHeight -
          this.videoElement.videoHeight * scale) /
          2 +
        this.pan.y;
      const offsetX =
        (this.videoElement.offsetWidth - this.videoElement.videoWidth * scale) /
          2 +
        this.pan.x;

      return {
        offsetX,
        offsetY,
        scale
      };
    },
    /**
     * Gets called when the operator clicks the canvas.
     *
     * @param {Event} event The click event.
     * @public
     */
    onMouseDown(event) {
      if (
        event.button === 0 &&
        this.isActive &&
        this.isClickable &&
        !this.isNavigating
      ) {
        const coord = this.getVideoCoordinatesOfEvent(event);
        if (this.isClickValid(coord)) {
          if (!this.isClickExistingWaypoint(coord)) {
            const wp = coord;
            wp.yaw = 0;
            this.addWaypointCoord(wp);
            this.isMouseDown = true;
          }
        }
      } else if (event.button === 1 && this.isActive) {
        this.isMiddleMouseDown = true;
        this.middleMouseStartPosition = { x: event.clientX, y: event.clientY };
      }
    },
    /**
     * Gets called when the operator moves its mouse after clicking..
     *
     * @param {Event} event The move event.
     * @public
     */
    onMouseMove(event) {
      if (this.isMouseDown) {
        const mousePosition = this.getVideoCoordinatesOfEvent(event);
        this.currentWaypoint.coordinate.yaw =
          (-Math.atan2(
            mousePosition.y - this.currentWaypoint.coordinate.y,
            mousePosition.x - this.currentWaypoint.coordinate.x
          ) *
            180) /
          Math.PI;
      } else if (this.isMiddleMouseDown) {
        const mousePosition = { x: event.clientX, y: event.clientY };
        this.middleMouseDeltaPosition = {
          x: mousePosition.x - this.middleMouseStartPosition.x,
          y: mousePosition.y - this.middleMouseStartPosition.y
        };
        this.pan = {
          x: this.previousPan.x + this.middleMouseDeltaPosition.x,
          y: this.previousPan.y + this.middleMouseDeltaPosition.y
        };
        this.$emit("panEvent", this.pan);
      }
    },
    /**
     * Gets called when the operator release the mouse button.
     *
     * @param {Event} event The release event.
     * @public
     */
    onMouseUp(event) {
      if (this.isMouseDown) {
        const mousePosition = this.getVideoCoordinatesOfEvent(event);

        this.currentWaypoint.coordinate.yaw =
          (-Math.atan2(
            mousePosition.y - this.currentWaypoint.coordinate.y,
            mousePosition.x - this.currentWaypoint.coordinate.x
          ) *
            180) /
          Math.PI;
        this.emitWaypoint();
        this.isMouseDown = false;

        this.currentWaypoint.coordinate = {
          x: -1,
          y: -1,
          yaw: 0
        };

        this.drawCanvas();
      } else if (this.isMiddleMouseDown) {
        this.previousPan.x = this.pan.x;
        this.previousPan.y = this.pan.y;
        this.isMiddleMouseDown = false;
      }
    },
    /**
     * Gets called when the operator mouse exit the canvas.
     *
     * @public
     */
    onMouseOut() {
      if (this.isMouseDown) {
        this.currentWaypoint.coordinate = {
          x: -1,
          y: -1,
          yaw: 0
        };
        this.isMouseDown = false;
      } else if (this.isMiddleMouseDown) {
        this.previousPan = this.pan;
        this.isMiddleMouseDown = false;
      }
    },
    /**
     * Adds a waypoint to the list.
     *
     * @param {Waypoint} wp The waypoint object.
     * @public
     */
    addWaypointCoord(wp) {
      Object.assign(this.currentWaypoint.coordinate, wp);
    },
    /**
     * Updates the current waypoint.
     *
     * @param {Waypoint} wp The waypoint object.
     * @public
     */
    emitWaypoint() {
      /**
       * The new waypoint event.
       *
       * @type {Object} The valid internal waypoint.
       */
      const temp = {};
      Object.assign(temp, this.currentWaypoint);
      this.$emit("newWaypoint", temp);
    },
    /**
     * Verifies if the operator click was valid.
     *
     * @param {Object} coord An object containing the x and y coordinate to validate.
     * @public
     */
    isClickValid(coord) {
      return (
        coord.x >= 0 &&
        coord.x < this.mapSize.width &&
        coord.y >= 0 &&
        coord.y < this.mapSize.height
      );
    },
    /**
     * Verifies the user clicked on an existing waypoint and if so emits an event.
     * Returns true if the click was on an existing waypoint and false if not.
     *
     * @param {Object} coord An object containing the x and y coordinate of the click.
     * @public
     */
    isClickExistingWaypoint(coord) {
      for (let i = 0; i < this.list.length; i++) {
        const dx = coord.x - this.list[i].coordinate.x;
        const dy = coord.y - this.list[i].coordinate.y;
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (dist <= this.wpRadius * 1.2) {
          this.$emit("removeWaypoint", i);
          return true;
        }
      }
      return false;
    }
  }
};
</script>

<style scoped></style>
