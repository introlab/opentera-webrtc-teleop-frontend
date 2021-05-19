<template>
  <div class="video-container flex-container">
      <div class="name-layout" v-show="showName">
          <span class="name-text">{{ name }}</span>
      </div>
      <video ref="video" v-bind:id="videoId" class="video-layout" autoplay/>
  </div>
</template>

<script>
export default {
    name: "video-participant",
    props: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        stream: {
            type: MediaStream,
            default: null
        },
        showName: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        videoId() {
            return "video-" + this.id;
        }
    },
    watch: {
        stream(newStream, oldStream) {
            this.$refs.video.srcObject = newStream;
        }
    },
    mounted() {
        this.$refs.video.srcObject = this.stream;
    },
    activated() {
        this.$refs.video.srcObject = this.stream;
        this.$refs.video.autoplay = true;
    }
}
</script>

<style lang="scss" scoped>
    @import "./VideoParticipant.scss";
</style>