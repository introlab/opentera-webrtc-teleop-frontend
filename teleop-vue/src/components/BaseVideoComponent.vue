<template>
    <div class="base-video-container">
      <div class="base-video-name-layout" v-show="showName">
        <span class="text-white">{{ name }}</span>
      </div>
      <video class="base-video-video" autoplay v-bind:id="videoId"></video>
    </div>
</template>

<script>
export default {
    name: 'base-video-component',
    props: {
        id : String,
        name : String,
        stream: {},
        showName : Boolean
    },
    computed: {
      videoId() {
        return 'video' + this.id;
      }
    },
    mounted() {
      document.getElementById('video' + this.id).srcObject = this.stream;
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
.base-video-video {
  width: 100%;
  height: auto;
}
</style>