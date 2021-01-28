<template>
  <div class="video-with-overlay-container">
    <div class="video-with-overlay-video-overlay">
      <video ref="overlayVideoRef" class="video-with-overlay-video mirror-y" v-bind:id="overlayVideoId" v-show="showOverlayVideo"></video>
    </div>
    <div class="container-fluid grid-padding">
      <!-- Laptops / Desktops -->
      <media query="(min-width: 992px)">
        <div class="row g-0" v-bind:class="'row-cols-' + nColumns + ' rows-' + nRows" >
          <div class="col" v-for="client in clientList" v-bind:key="client.id">
            <base-video 
              v-bind:id="client.id" 
              v-bind:name="client.name" 
              v-bind:stream="client.stream" 
              v-bind:show-name="true">
            </base-video>
          </div>
        </div>
      </media>
      <!-- landscape tablets -->
      <media query="(min-width: 768px) and (max-width: 991.98px)">
        
      </media>
      <!-- portrait tablets / large phones -->
      <media query="(min-width: 600px) and (max-width: 767.98px)">
        
      </media>
      <!-- phones -->
      <media query="(max-width: 599.98px)">
        
      </media>
    </div>
  </div>
</template>

<script>
import { ref, toRefs } from "vue";

import Media from './Media';
import BaseVideo from "./BaseVideo";

import useVideoOverlay from "../composables/VideoConference/useVideoOverlay";
import useVideosLayout from "../composables/VideoConference/useVideosLayout";

export default {
    name: 'video-conference',
    components: {
      Media,
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
      const { clientList } = toRefs(props);

      const overlayVideoRef = ref(null);
      useVideoOverlay(overlayVideoRef);

      const { nColumns, nRows } = useVideosLayout(clientList);

      return {
        overlayVideoRef,
        nColumns,
        nRows
      };
    }
}
</script>

<style>
.video-with-overlay-container {
  width: 100%;
  height: 100%;
  display: flex;
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
  padding: .75rem;
}
.row {
  height: 100%;
}
.row > * {
  padding: .25rem !important;
}
.rows-1 > * {height: 100%;}
.rows-2 > * {height: 50%;}
.rows-3 > * {height: 33.33%;}
.rows-4 > * {height: 25%;}
.rows-5 > * {height: 20%;}
.rows-6 > * {height: 16.66%;}
.rows-7 > * {height: 14.29%;}
.rows-8 > * {height: 12.5%;}
</style>