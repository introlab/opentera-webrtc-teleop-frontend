<template>
  <div class="video-with-overlay-container">
    <div class="video-with-overlay-video-overlay">
      <video ref="overlayVideoRef" class="video-with-overlay-video mirror-y" v-bind:id="overlayVideoId" v-show="showOverlayVideo"></video>
    </div>
    <div class="container-fluid grid-padding">
      <div class="row g-2" v-bind:class="'row-cols-' + nColumns">
        <div class="col" v-for="client in clientList" v-bind:key="client.id">
          <base-video 
            v-bind:id="client.id" 
            v-bind:name="client.name" 
            v-bind:stream="client.stream" 
            v-bind:show-name="true">
          </base-video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";

import BaseVideo from "./BaseVideo";

import useVideoOverlay from "../composables/VideoConference/useVideoOverlay";
import useVideosLayout from "../composables/VideoConference/useVideosLayout";

export default {
    name: 'video-conference',
    components: {
        BaseVideo
    },
    props: {
        overlayVideoId : String,
        showOverlayVideo : Boolean,
        clientList: {
            type: Array
        }
    },
    setup(props) {
      // eslint-disable-next-line
      const { clientList } = toRefs(props);

      const overlayVideoRef = ref(null);
      useVideoOverlay(overlayVideoRef);

      const { nColumns } = useVideosLayout(clientList);

      return {
        overlayVideoRef,
        nColumns
      };
    }
}
</script>

<style>
.video-with-overlay-container {
  display: inline-block;
  position: relative;
}
.video-with-overlay-video-overlay {
  position: absolute;
  right: 0px;
  bottom: 0px;
  margin: 10px;
  padding: 5px 5px;
  width: 20%;
  height: 20%;
  z-index: 1;
}
.video-with-overlay-video {
  width: 100%;
  height: 100%;
}
.mirror-y {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg); /* Safari and Chrome */
  -moz-transform: rotateY(180deg); /* Firefox */
}
.grid-padding {
  padding: .75rem .75rem .75rem .75rem;
}
</style>