<template>
  <div
    class="btn-toolbar"
    role="toolbar"
    aria-label="Toolbar with button groups"
  >
    <div class="btn-group" role="group" aria-label="Group button">
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleCamera"
      >
        <svg-icon icon="camera-video-fill" v-if="isCameraOn" />
        <svg-icon icon="camera-video-off-fill" v-else />
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleMute"
      >
        <svg-icon icon="mic-fill" v-if="!isMuted" />
        <svg-icon icon="mic-mute-fill" v-else />
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleCameraDisplayMode"
      >
        <svg-icon icon="both-cameras" v-if="cameraDisplayMode == 0" />
        <svg-icon icon="top-camera-only" v-if="cameraDisplayMode == 1" />
        <svg-icon icon="bottom-camera-only" v-if="cameraDisplayMode == 2" />
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleShowControls"
      >
        <svg-icon icon="show-controls" v-if="showControls" />
        <svg-icon icon="hide-controls" v-else />
      </button>
    </div>
    <div class="btn-group" role="group" aria-label="Group button">
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleParticipantsList"
      >
        <svg-icon icon="people-fill" v-if="showParticipants" />
        <svg-icon icon="people" v-else />
      </button>
    </div>
  </div>
</template>

<script>
import useButtons from "./useButtons";
import { SvgIcon } from "@/components/SvgIcon";

export default {
  name: "button-conference",
  components: {
    SvgIcon
  },
  setup() {
    const {
      isInCall,
      isMuted,
      isCameraOn,
      showParticipants,
      cameraDisplayMode,
      showControls,

      toggleMute,
      toggleCamera,
      toggleParticipantsList,
      toggleCameraDisplayMode,
      toggleShowControls
    } = useButtons();

    return {
      isInCall,
      isMuted,
      isCameraOn,
      showParticipants,
      cameraDisplayMode,
      showControls,

      toggleMute,
      toggleCamera,
      toggleParticipantsList,
      toggleCameraDisplayMode,
      toggleShowControls
    };
  }
};
</script>

<style scoped>
@import "./ButtonConference.scss";
</style>
