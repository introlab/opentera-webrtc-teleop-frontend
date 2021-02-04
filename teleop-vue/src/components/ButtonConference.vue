<template>
  <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
      <div class="btn-group button-group btn-group-lg" role="group" aria-label="Call controler">
          <button type="button" class="btn btn-secondary" v-on:click="cameraEvent">
              <img v-bind:src="this.cameraImg" alt="Camera video on">
          </button>
          <button type="button" class="btn btn-secondary" v-on:click="micEvent">
              <img v-bind:src="this.micImg" alt="Mic on">
          </button>
          <button type="button" class="btn btn-secondary" v-on:click="callEvent">
              <img v-bind:src="this.callImg" alt="Call all">
          </button>
      </div>
  </div>
</template>

<script>
export default {
    name: "button-conference",
    data() {
        return {
            callImg: require("../assets/telephone-inbound.svg"),
            micImg : require("../assets/mic-fill.svg"),
            cameraImg: require("../assets/camera-video-fill.svg"),

            isConnected: false,
            isMuted: false,
            isCameraOff: false,
            isOnCall: false
        }
    },
    emits : [
        "callAll",
        "hangUpAll"
    ],
    methods: {
        nextState(bool) {
            return bool ? false : true;
        },
        callEvent() {
            this.isOnCall = this.nextState(this.isOnCall);
            if (this.isOnCall) {
                this.callImg = require("../assets/telephone-outbound-fill.svg");
                this.$emit("callAll");
            } else {
                this.callImg = require("../assets/telephone-inbound.svg")
                this.$emit("hangUpAll");
            }           
        },
        micEvent() {
            this.isMuted = this.nextState(this.isMuted);
            if (this.isMuted) {
                this.micImg = require("../assets/mic-mute-fill.svg");
                //this.$emit("callAll");
            } else {
                this.micImg = require("../assets/mic-fill.svg")
                //this.$emit("hangUpAll");
            } 
        },
        cameraEvent() {
            this.isCameraOff = this.nextState(this.isCameraOff);
            if (this.isCameraOff) {
                this.cameraImg = require("../assets/camera-video-off-fill.svg");
                //this.$emit("callAll");
            } else {
                this.cameraImg = require("../assets/camera-video-fill.svg")
                //this.$emit("hangUpAll");
            }  
        }
    }
}
</script>

<style>
.button-group {
    position: absolute !important;
    display: inline-table !important;
    bottom: 4.5rem;
    margin: 15px auto;
    right: 0;
    left: 0;
    z-index: 2;
}
</style>