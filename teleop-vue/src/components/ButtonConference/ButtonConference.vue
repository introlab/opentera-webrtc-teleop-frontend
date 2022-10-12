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
      <div class="dropup">
        <button
          type="button"
          class="btn btn-primary-dark btn-dropup-middle" 
          v-on:click="setSessionMicVolume(true)"
        >
          <svg-icon v-if="sessionMicVolume > 0" icon="mic-fill"/>
          <svg-icon v-else icon="mic-mute-fill"/>
        </button>
        <div class="dropup-content">
          <input
            type="range"
            min="0"
            max="1"
            value="1"
            step="0.01"
            class="slider"
            id="sessionMicVolumeSlider"
            @input="setSessionMicVolume(false)"
          />
        </div>
      </div>
      <div class="dropup">
        <button
          type="button"
          class="btn btn-primary-dark btn-dropup-middle" 
          v-on:click="setSessionVolume(true)"
        >
        <!-- ajouter on click mute direct-->
          <svg-icon v-if="sessionVolume >= 0.5" icon="volume-up"/>
          <svg-icon v-else-if="sessionVolume == 0" icon="volume-mute"/>
          <svg-icon v-else icon="volume-down"/>
        </button>
        <div class="dropup-content">
          <input
            type="range"
            min="0"
            max="1"
            value="1"
            step="0.01"
            class="slider"
            id="sessionVolumeSlider"
            @input="setSessionVolume(false)"
          />
        </div>
      </div>
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleCameraDisplayMode"
        v-if="!robotCaps.isSingleCamera"
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
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleShowSettings"
      >
        <svg-icon icon="gear" />
      </button>
      <button
        type="button"
        class="btn btn-primary-dark"
        v-on:click="toggleRobotCamera"
      >
        <svg-icon icon="robot-camera-video-fill" v-if="isRobotCameraOn" />
        <svg-icon icon="robot-camera-video-off-fill" v-else />
      </button>
      <div class="dropup">
        <button
          type="button"
          class="btn btn-primary-dark btn-dropup-middle"
          v-on:click="setRobotMicVolume(true)"
        >
          <svg-icon v-if="robotMicVolume > 0" icon="robot-mic-fill"/>
          <svg-icon v-else icon="robot-mic-mute-fill"/>
        </button>
        <div class="dropup-content">
          <input
            type="range"
            min="0"
            max="1"
            value="1"
            step="0.01"
            class="slider"
            id="robotMicVolumeSlider"
            @input="setRobotMicVolume(false)"
          />
        </div>
      </div>
       <div class="dropup">
        <button
          type="button"
          class="btn btn-primary-dark btn-dropup-right" 
          v-on:click="setRobotVolume(true)"
        >
          <svg-icon v-if="robotVolume >= 0.5" icon="volume-up-robot"/>
          <svg-icon v-else-if="robotVolume == 0" icon="volume-mute-robot"/>
          <svg-icon v-else icon="volume-down-robot"/>
        </button>
        <div class="dropup-content">
          <input
            type="range"
            min="0"
            max="1"
            value="1"
            step="0.01"
            class="slider"
            id="robotVolumeSlider"
            @input="setRobotVolume(false)"
          />
        </div>
      </div>
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
    SvgIcon,
  },
  setup() {
    const {
      isInCall,
      isCameraOn,
      sessionMicVolume,
      sessionVolume,
      showParticipants,
      cameraDisplayMode,
      showControls,
      robotMicVolume,
      isRobotCameraOn,
      robotVolume,

      toggleCamera,
      setSessionMicVolume,
      setSessionVolume,
      toggleParticipantsList,
      toggleCameraDisplayMode,
      toggleShowControls,
      toggleShowSettings,
      toggleRobotCamera,
      setRobotMicVolume,
      setRobotVolume,
    } = useButtons();

    return {
      isInCall,
      isCameraOn,
      sessionMicVolume,
      sessionVolume,
      showParticipants,
      cameraDisplayMode,
      showControls,
      robotMicVolume,
      isRobotCameraOn,
      robotVolume,

      toggleCamera,
      setSessionMicVolume,
      setSessionVolume,
      toggleParticipantsList,
      toggleCameraDisplayMode,
      toggleShowControls,
      toggleShowSettings,
      toggleRobotCamera,
      setRobotMicVolume,
      setRobotVolume,
    };
  },
  inject: ["robotCaps"],
};
</script>

<style scoped>
@import "./ButtonConference.scss";
</style>
