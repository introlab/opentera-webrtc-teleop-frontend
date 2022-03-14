<template>
  <div class="container-fluid bg-primary-dark" v-on:mousemove="showToolbar">
    <user-video />
    <div class="container-fluid">
      <video-conference v-bind:clients-list="clientsInCall"> </video-conference>
    </div>
    <div ref="toolbarRef" class="toolbar">
      <button-conference />
    </div>
    <transition name="participants">
      <participants-list
        v-if="showParticipants"
        v-bind:clients-in-call="clientsInCall"
        v-bind:clients-in-room="clientsInRoom"
      >
      </participants-list>
    </transition>
  </div>
</template>

<script>
import { ref } from "vue";

import useToolbar from "./useToolbar";

import { BusyException } from "@/store/modules/opentera";

import { VideoConference } from "@/components/VideoConference";
import { ButtonConference } from "@/components/ButtonConference";
import { ParticipantsList } from "@/components/ParticipantsList";
import UserVideo from "@/components/UserVideo/UserVideo.vue";

export default {
  name: "conference-view",
  components: {
    VideoConference,
    ButtonConference,
    ParticipantsList,
    UserVideo,
  },
  data() {
    return {
      client: null,
    };
  },
  props: {
    name: String,
    data: Object,
    room: String,
    password: String,
    robot: String,
  },
  setup() {
    const toolbarRef = ref(null);
    const { showToolbar } = useToolbar(toolbarRef);

    return {
      toolbarRef,
      showToolbar,
    };
  },
  computed: {
    clientsInCall() {
      return this.$store.state.localClient.openteraVideoConf.clientsInCall;
    },
    clientsInRoom() {
      return this.$store.state.localClient.openteraVideoConf.clientsInRoom;
    },
    showParticipants() {
      return this.$store.state.localClient.openteraVideoConf.showParticipants;
    },
  },
  unmounted() {
    this.$store.dispatch("localClient/destroy");
  },
};
</script>

<style lang="scss" scoped>
@import "./ConferenceView.scss";
</style>
