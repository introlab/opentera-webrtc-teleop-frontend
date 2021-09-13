<script>
export default {
    props: ["absoluteMaxX", "absoluteMaxY"],
    data() {
        return {
            cmd: {x: 0, y: 0}
        }
    },
    emits: [
        "keyboardTeleopEvent"
    ],
    created() {
        console.log("Starting keyboard teleop");
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    },
    unmounted() {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    },
    methods: {
        onKeyDown(event) {
            if(event.key === "ArrowUp") {
                this.cmd.y = -this.absoluteMaxY;
            }
            else if(event.key === "ArrowDown") {
                this.cmd.y = this.absoluteMaxY;
            }
            else if(event.key === "ArrowRight") {
                this.cmd.x = this.absoluteMaxX;
            }
            else if(event.key === "ArrowLeft") {
                this.cmd.x = -this.absoluteMaxX;
            }
            this.emitKeyboardCmd();
        },
        onKeyUp(event) {
            if(event.key === "ArrowUp") {
                this.cmd.y = 0;
            }
            else if(event.key === "ArrowDown") {
                this.cmd.y = 0;
            }
            else if(event.key === "ArrowRight") {
                this.cmd.x = 0;
            }
            else if(event.key === "ArrowLeft") {
                this.cmd.x = 0;
            }
            this.emitKeyboardCmd();
        },
        emitKeyboardCmd() {
            this.$emit("keyboadCmdEvent", this.cmd);
        }
    }
}
</script>