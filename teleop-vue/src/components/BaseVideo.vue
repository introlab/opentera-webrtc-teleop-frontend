<template>
    <div class="base-video-container">
      <div class="base-video-name-layout" v-show="showName">
        <span class="base-video-name-text">{{ name }}</span>
      </div>
      <video class="base-video-video" autoplay v-bind:id="videoId"></video>
    </div>
</template>

<script>
export default {
    name: 'base-video',
    props: {
        id : String,
        name : String,
        stream: {},
        showName : Boolean
    },
    computed: {
      videoId() {
        return 'video-' + this.id;
      }
    },
    mounted() {
      document.getElementById('video-' + this.id).srcObject = this.stream;
    }
}
</script>

<style>
.base-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}
.base-video-name-layout {
  position: absolute;
  left: 0px;
  bottom: 0px;
  margin: 10px;
  padding: 5px 5px;
}
.base-video-name-layout::before {
  content: "";
  width: 100%;
  height: 100%;
  background-color: var(--bs-dark);
  opacity: 0.75;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  border-radius: .25rem;
}
.base-video-name-text {
  position: relative;
  z-index: 2;
  color: var(--bs-light);
}
.base-video-video {
  width: 100%;
  height: auto;
  object-fit: cover;
}
</style>