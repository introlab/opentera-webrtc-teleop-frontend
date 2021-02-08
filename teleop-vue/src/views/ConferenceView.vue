<template>
  <div class="full-height" v-on:mousemove="showButtons">
    <div class="flex-outer-container full-height bg-dark">
      <div class="flex-inner-container full-height">
        <video-conference
          v-bind:client-list="clientList"
          v-bind:is-fullscreen="true"
        >
        </video-conference>
      </div>
    </div>
    <div ref="toolbarRef" id="toolbar" class="toolbar">
      <video
        ref="overlayVideoRef"
        class="overlay-video mirror-y"
        id="overlayVideo"
        v-show="this.showOverlayVideo"
      ></video>
      <button-conference></button-conference>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

import useVideoOverlay from "../composables/ConferenceView/useVideoOverlay";
import useButtons from "../composables/ConferenceView/useButtons";

import VideoConference from "../components/VideoConference";
import ButtonConference from "../components/ButtonConference";

export default {
    name: "conference-view",
    components: {
      VideoConference,
      ButtonConference
    },
    data() {
      return {
        showOverlayVideo: true
      };
    },
    setup() {

      const overlayVideoRef = ref(null);
      const toolbarRef = ref(null);

      useVideoOverlay(overlayVideoRef);
      const { showButtons } = useButtons(toolbarRef, overlayVideoRef);

      return { 
        overlayVideoRef,
        toolbarRef,
        showButtons
      };
    },
    computed: {
        clientList() {
            return this.$store.state.opentera.clientList;
        }
    }
}
</script>

<style>
.flex-outer-container {
    position: relative;
    display: flex;
    background-clip: border-box;
}
.flex-inner-container {
    flex: 1 1 auto;
    padding: 1rem 1rem;
}
.full-height {
    height: 100%;
}
.toolbar {
  --transition-speed: 500ms;
  --default-height: 1px;
  --hovering-height: 7rem;
  --default-video-height: 0px;
  --hovering-video-height: 5rem;
  position: absolute;
  bottom: 0px;
  width: 100vw;
  height: var(--default-height);
  transition: height var(--transition-speed) ease;
}
.button-controler {
    position: absolute;
    align-content: center;
    right: 50%;
    left: 50%;
    margin: 10px;
    padding: 5px 5px;
    z-index: 1;
}
.overlay-video {
  position: absolute;
  right: 0px;
  bottom: var(--default-video-height);
  margin: 1.5rem;
  padding: 5px 5px;
  width: 20%;
  z-index: 3;
  transition: bottom var(--transition-speed) ease;
}
.mirror-y {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
</style>