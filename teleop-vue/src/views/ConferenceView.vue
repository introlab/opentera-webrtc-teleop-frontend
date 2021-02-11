<template>
  <div class="full-height">
    <div class="flex-outer-container full-height bg-dark">
      <div class="flex-inner-container full-height" v-on:mousemove="showButtons">
        <video-conference
          v-bind:client-list="clientsInCall"
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
    <transition name="participants">
      <div class="right-side-bar" v-if="showParticipants">
        <div class="participants-top-bar">
          <span class="participants-title">Participants</span>
          <button type="button" class="icon-button" v-on:click="closeParticipantsEvent">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
          </button>
        </div>
        <participants-list 
          v-bind:clients-in-call="clientsInCall"
          v-bind:clients-in-room="clientsInRoom">
        </participants-list>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

import useVideoOverlay from "../composables/ConferenceView/useVideoOverlay";
import useButtons from "../composables/ConferenceView/useButtons";
import useParticipantsList from "../composables/ConferenceView/useParticipantsList";

import VideoConference from "../components/VideoConference";
import ButtonConference from "../components/ButtonConference";
import ParticipantsList from '../components/ParticipantsList';

export default {
    name: "conference-view",
    components: {
      VideoConference,
      ButtonConference,
      ParticipantsList
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
      const { showParticipants, closeParticipantsEvent } = useParticipantsList(overlayVideoRef);

      return { 
        overlayVideoRef,
        toolbarRef,
        showButtons,
        showParticipants,
        closeParticipantsEvent
      };
    },
    computed: {
        clientsInCall() {
            return this.$store.state.opentera.clientsInCall;
        },
        clientsInRoom() {
          return this.$store.state.opentera.clientsInRoom;
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
.right-side-bar {
  color: #fff;
  background-color: var(--bs-dark);
  position: absolute;
  top: 0;
  right: 0px;
  width: 16rem;
  height: 100%;
  padding: 1rem 0;
  z-index: 4;
}
.participants-enter-active,
.participants-leave-active {
  transition: all 500ms ease;
}
.participants-enter-from,
.participants-leave-to {
  transform: translate(16rem);
}
.icon-button {
    display: inline-block;
    color: inherit;
    border-color: rgba(255, 255, 255, 0.3);
    border-radius: 0.25rem !important;
    background-color: transparent;
}
.icon-button:focus {
    outline: none;
}
.icon-button > svg {
    transition: filter 150ms ease-in-out, -webkit-filter 150ms ease-in-out;
}
.icon-button:hover > svg {
    -webkit-filter: drop-shadow(0.125rem 0.25rem 0.1rem rgba(0, 0, 0, 1));
    filter: drop-shadow(0.125rem 0.25rem 0.1rem rgba(0, 0, 0, 1));
}
.participants-top-bar {
  position: relative;
  display: inline-flex;
  justify-content: space-between;
  align-content: center;
  padding: 0 0.5rem;
  width: 100%;
}
.participants-title {
  font-size: 1.25rem;
  font-weight: 1000;
  text-align: start;
  line-height: 2;
}
</style>