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
        <svg-icon icon="both_cameras" v-if="cameraDisplayMode == 0" />
        <svg-icon icon="top_camera_only" v-if="cameraDisplayMode == 1" />
        <svg-icon icon="bottom_camera_only" v-if="cameraDisplayMode == 2" />
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

      toggleCall,
      toggleMute,
      toggleCamera,
      toggleParticipantsList,
      toggleCameraDisplayMode
    } = useButtons();

    return {
      isInCall,
      isMuted,
      isCameraOn,
      showParticipants,
      cameraDisplayMode,

      toggleCall,
      toggleMute,
      toggleCamera,
      toggleParticipantsList,
      toggleCameraDisplayMode
    };
  }
};
</script>

<style scoped>
@import "./ButtonConference.scss";
</style>
