<script>
export default {
  props: ["absoluteMaxX", "absoluteMaxZ"],
  data() {
    return {
      cmd: { x: 0, z: 0 }
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
      this.emitKeyboardCmd();
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
      this.$emit("keyboadCmdEvent", this.cmd);
    }
  }
};
</script>
