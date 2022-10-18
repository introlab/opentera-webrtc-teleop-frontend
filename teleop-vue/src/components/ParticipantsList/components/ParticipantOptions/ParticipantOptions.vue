<template>
  <div class="participant-container">
    <span>{{ participant.name }}</span>
    <button
      type="button"
      class="icon-button right-side"
      v-on:click="toggleMute(participant)"
      v-if="participant == localClient"
    >
      <svg-icon v-if="sessionMicVolume > 0" icon="mic-fill"/>
      <svg-icon v-else icon="mic-mute-fill"/>
    </button>
    <button
      type="button"
      class="icon-button right-side"
      v-on:click="toggleMute(participant)"
      v-else
    >
      <svg-icon v-if="robotMicVolume > 0" icon="mic-fill"/>
      <svg-icon v-else icon="mic-mute-fill"/>
    </button>

    <button type="button" class="icon-button">
      <svg-icon icon="three-dots" />
    </button>
  </div>
</template>

<script>
import useButtons from "./useButtons";

import { SvgIcon } from "@/components/SvgIcon";

export default {
  name: "participant-options",
  components: {
    SvgIcon,
  },
  props: {
    participant: Object,
  },
  setup() {
    const { toggleMute, sessionMicVolume, robotMicVolume, localClient } = useButtons();

    return {
      toggleMute,
      sessionMicVolume,
      robotMicVolume,
      localClient
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./ParticipantOptions.scss";
</style>
