<template>
  <div class="participants-list bg-secondary-dark">
    <div class="participants-top-bar">
      <span class="participants-title">Participants</span>
      <button
        type="button"
        class="icon-button"
        v-on:click="closeParticipantsList"
      >
        <svg-icon icon="arrow-right" />
      </button>
    </div>
    <h4 v-if="isInCall">Currently in this call</h4>
    <participant-options v-bind:participant="localClient" v-if="isInCall" />
    <participant-options
      v-for="client in clientsInCall"
      v-bind:key="client.id"
      v-bind:participant="client"
    />
    <h4 v-if="clientsNotInCall.length > 0 || !isInCall">
      Currently in the room
    </h4>
    <participant-options v-bind:participant="localClient" v-if="!isInCall" />
    <participant-options
      v-for="client in clientsNotInCall"
      v-bind:key="client.id"
      v-bind:participant="client"
    />
  </div>
</template>

<script>
import { ParticipantOptions } from "./components/ParticipantOptions";
import { SvgIcon } from "@/components/SvgIcon";

export default {
  name: "participants-list",
  components: {
    ParticipantOptions,
    SvgIcon
  },
  props: {
    clientsInCall: Array,
    clientsInRoom: Array
  },
  methods: {
    closeParticipantsList() {
      this.$store.commit(
        "localClient/openteraVideoConf/toggleParticipantsList"
      );
    }
  },
  computed: {
    localClient() {
      return this.$store.state.localClient;
    },
    localStreamClient() {
      return this.$store.state.localClient.openteraVideoConf.client;
    },
    isInCall() {
      return this.$store.state.localClient.isInCall;
    },
    clientsNotInCall() {
      return this.clientsInRoom.filter(
        client =>
          !this.clientsInCall.some(i => i.id === client.id) &&
          client.id !== this.localStreamClient.id
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ParticipantsList.scss";
</style>
