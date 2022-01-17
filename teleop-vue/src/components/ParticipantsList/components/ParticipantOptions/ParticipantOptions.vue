<template>
  <div class="participant-container">
    <span>{{ participant.name }}</span>
    <button
      type="button"
      class="icon-button right-side"
      v-on:click="toggleMute"
    >
      <svg-icon icon="mic-fill" v-if="!isMuted" />
      <svg-icon icon="mic-mute-fill" v-else />
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
    const { toggleMute, isMuted } = useButtons();

    return {
      toggleMute,
      isMuted,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "./ParticipantOptions.scss";
</style>
