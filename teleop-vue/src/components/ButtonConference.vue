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
      <div class="btn-group button-group btn-group-lg" role="group" aria-label="Room's informations">
          <button type="button" class="btn btn-secondary" v-on:click="participantsEvent">
              <img v-bind:src="this.participantsIcon" alt="Participants">
          </button>
      </div>
  </div>
</template>

<script>
import useCallsButtons from "../composables/ButtonConference/useCallsButtons";
import useRoomsButtons from "../composables/ButtonConference/useRoomsButtons";

export default {
    name: "button-conference",
    setup() {
        const { callImg, micImg, cameraImg, callEvent, micEvent, cameraEvent } = useCallsButtons();
        const { participantsIcon, participantsEvent } = useRoomsButtons();

        return {
            callImg, micImg, cameraImg, callEvent, micEvent, cameraEvent,
            participantsIcon, participantsEvent
        }
    }
}
</script>

<style>
.btn-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}
.button-group {
    margin: .5rem;
    z-index: 2;
}
</style>