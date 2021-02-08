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
import useButtons from "../composables/ButtonConference/useButtons";

export default {
    name: "button-conference",
    setup() {
        const { callImg, micImg, cameraImg, callEvent, micEvent, cameraEvent } = useButtons();

        return {
            callImg,
            micImg,
            cameraImg,

            callEvent,
            micEvent, 
            cameraEvent
        }
    }
}
</script>

<style>
.button-group {
    position: absolute !important;
    display: inline-table !important;
    margin: 16px auto;
    right: 0;
    left: 0;
    z-index: 2;
}
</style>