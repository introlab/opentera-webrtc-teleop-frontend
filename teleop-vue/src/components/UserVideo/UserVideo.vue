<template>
  <video
    v-show="isCameraOn"
    ref="overlayVideoRef"
    id="overlayVideo"
    class="user-video mirror-y"
    disablePictureInPicture
    @click="onClick"
    :class="{ 'top-left': top }"
  />
</template>

<script>
import { ref } from "vue";
import useVideoLayout from "./useVideoOverlay";

export default {
  name: "user-video",
  data() {
    return {
      top: false,
    };
  },
  setup() {
    const overlayVideoRef = ref(null);
    useVideoLayout(overlayVideoRef);
    return {
      overlayVideoRef,
    };
  },
  activated() {
    // Reactivate the local video when it's render from cache
    const overlayVideo = this.$refs.overlayVideoRef;
    overlayVideo.muted = true;
    overlayVideo.srcObject = this.$store.state.localClient.openteraVideoConf.localStream;
    overlayVideo.autoplay = true;
    overlayVideo.style.display = "inline";
  },
  computed: {
    isCameraOn() {
      return this.$store.state.localClient.isCameraOn;
    },
  },
  methods: {
    onClick() {
      this.top = !this.top;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./UserVideo.scss";
</style>
