<template>
  <div></div>
</template>

<script>
export default {
  props: {
    absoluteMaxX: {
      // Maximum linear velocity in m/s
      type: Number,
      required: true,
    },
    absoluteMaxYaw: {
      // Maximum angular velocity in rad/s
      type: Number,
      required: true,
    },
    publishingRate: {
      type: Number,
      required: false,
      default: 10, // Hz
    },
    enabled: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      cmd: { x: 0, yaw: 0 },
      loopIntervalId: false,
    };
  },
  emits: ["keyboardCmdEvent"],
  created() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  },
  unmounted() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  },
  methods: {
    onKeyDown(event) {
      if (event.key === "ArrowUp") {
        this.cmd.x = this.absoluteMaxX;
      } else if (event.key === "ArrowDown") {
        this.cmd.x = -this.absoluteMaxX;
      } else if (event.key === "ArrowRight") {
        this.cmd.yaw = -this.absoluteMaxYaw;
      } else if (event.key === "ArrowLeft") {
        this.cmd.yaw = this.absoluteMaxYaw;
      }
      if (!this.loopIntervalId) {
        this.emitLoop();
      }
    },
    onKeyUp(event) {
      if (event.key === "ArrowUp") {
        this.cmd.x = 0;
      } else if (event.key === "ArrowDown") {
        this.cmd.x = 0;
      } else if (event.key === "ArrowRight") {
        this.cmd.yaw = 0;
      } else if (event.key === "ArrowLeft") {
        this.cmd.yaw = 0;
      }
      this.emitKeyboardCmd();
    },
    emitKeyboardCmd() {
      if (this.enabled) {
        this.$emit("keyboardCmdEvent", this.cmd);
      }
    },
    emitLoop() {
      this.loopIntervalId = setInterval(
        function() {
          this.emitKeyboardCmd();
          if (this.cmd.x == 0 && this.cmd.yaw == 0) {
            clearInterval(this.loopIntervalId);
            this.loopIntervalId = false;
          }
        }.bind(this),
        1000 / this.publishingRate
      );
    },
  },
};
</script>
