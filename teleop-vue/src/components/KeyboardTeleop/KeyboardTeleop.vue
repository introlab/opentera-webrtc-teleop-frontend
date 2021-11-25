<script>
export default {
  props: {
    absoluteMaxX: {
      type: Number,
      required: true
    },
    absoluteMaxZ: {
      type: Number,
      required: true
    },
    publishingRate: {
      type: Number,
      required: false,
      default: 10 // Hz
    }
  },
  data() {
    return {
      cmd: { x: 0, z: 0 },
      loopIntervalId: false
    };
  },
  emits: ["keyboardTeleopEvent"],
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
        this.cmd.z = -this.absoluteMaxZ;
      } else if (event.key === "ArrowLeft") {
        this.cmd.z = this.absoluteMaxZ;
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
        this.cmd.z = 0;
      } else if (event.key === "ArrowLeft") {
        this.cmd.z = 0;
      }
      this.emitKeyboardCmd();
    },
    emitKeyboardCmd() {
      console.log(this.cmd);
      this.$emit("keyboadCmdEvent", this.cmd);
    },
    emitLoop() {
      this.loopIntervalId = setInterval(
        function() {
          this.emitKeyboardCmd();
          if (this.cmd.x == 0 && this.cmd.z == 0) {
            clearInterval(this.loopIntervalId);
            this.loopIntervalId = false;
          }
        }.bind(this),
        1000 / this.publishingRate
      );
    }
  }
};
</script>
